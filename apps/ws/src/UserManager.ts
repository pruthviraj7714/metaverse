import { WebSocket } from "ws";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import client from "@repo/db/src/db";
import { RoomManager } from "./RoomManager";

export class User {
  private ws: WebSocket;
  public userId?: string;
  public spaceId?: string;
  private x = 0;
  private y = 0;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      console.log(`Received message from user: ${JSON.stringify(parsedData)}`);

      switch (parsedData.type) {
        case "join":
          console.log("User Joined:", parsedData);
          await this.handleJoin(parsedData);
          break;
        case "move":
          console.log("User moved to position", parsedData.data);
          await this.handleMove(parsedData);
          break;
        default:
          console.log("Unknown message type:", parsedData.type);
      }
    });
  }

  private async handleJoin(parsedData: any): Promise<void> {
    const { spaceId, token } = parsedData.payload;

    try {
      const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
      if (!decoded.userId) {
        console.error("Invalid token");
        this.ws.close();
        return;
      }
      this.userId = decoded.userId;

      const space = await client.space.findFirst({
        where: { id: spaceId },
        include: { map: true },
      });

      if (!space) {
        console.error("Space not found");
        this.ws.close();
        return;
      }

      this.spaceId = spaceId;
      RoomManager.getInstance().addUser(this.spaceId!, this);

      const dimensions = space.map?.dimensions ?? { width: 0, height: 0 };
      this.x = Math.floor(
        Math.random() * ((space?.map?.dimensions as any)?.width ?? 0)
      );
      this.y = Math.floor(
        Math.random() * ((space?.map?.dimensions as any)?.height ?? 0)
      );
      this.send({
        type: "user-joined",
        payload: {
          spawn: { x: this.x, y: this.y },
          users: RoomManager.getInstance().rooms
            .get(spaceId)
            ?.filter((u) => u.userId !== this.userId)
            .map((user) => ({ id: user.userId })) ?? [],
        },
      });

      RoomManager.getInstance().broadcast(
        {
          type: "user-joined",
          payload: {
            userId: this.userId,
            x: this.x,
            y: this.y,
          },
        },
        this,
        this.spaceId!
      );
    } catch (error) {
      console.error("Failed to handle join:", error);
      this.ws.close();
    }
  }

  private async handleMove(parsedData: any): Promise<void> {
    const { x: targetX, y: targetY } = parsedData.payload;

    const xDistance = Math.abs(this.x - targetX);
    const yDistance = Math.abs(this.y - targetY);

    if ((xDistance === 1 && yDistance === 0) || (xDistance === 0 && yDistance === 1)) {
      this.x = targetX;
      this.y = targetY;
      RoomManager.getInstance().broadcast(
        {
          type: "movement",
          payload: { x: this.x, y: this.y },
        },
        this,
        this.spaceId!
      );
    } else {
      this.send({
        type: "movement-rejected",
        payload: { x: this.x, y: this.y },
      });
    }
  }

  public destroy(): void {
    RoomManager.getInstance().broadcast(
      {
        type: "user-left",
        payload: { userId: this.userId },
      },
      this,
      this.spaceId!
    );
    RoomManager.getInstance().removeUser(this, this.spaceId!);
  }

  private send(payload: any): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
}
