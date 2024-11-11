import { WebSocket } from "ws";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import client from "@repo/db/client";
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
      try {
        const parsedData = JSON.parse(data.toString());
        console.log(`Received message from user: ${JSON.stringify(parsedData)}`);
  
        switch (parsedData.type) {
          case "join":
            await this.handleJoin(parsedData);
            break;
          case "move":
            await this.handleMove(parsedData);
            break;
          default:
            this.send({ type: "error", message: "Unknown message type" });
        }
      } catch (error) {
        console.error("Invalid message format:", error);
        this.send({ type: "error", message: "Invalid message format" });
      }
    });
  }

  private async handleJoin(parsedData: any): Promise<void> {
    const { spaceId, token } = parsedData.payload;

    try {
      const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
      if (!decoded.id) {
        console.error("Invalid token");
        this.ws.close();
        return;
      }
      this.userId = decoded.id;

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
