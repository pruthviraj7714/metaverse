import { WebSocket } from "ws";
import  Jwt, { JwtPayload }  from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import client from "@repo/db/src/db"
import { RoomManager } from "./RoomManager";

export class User {
    private ws : WebSocket;
    public userId? : string;
    public spaceId? : string;
    private x : number = 0;
    private y : number = 0;

    constructor(ws : WebSocket) {
        this.ws = ws;
        this.setupMessageHandler()
    }

    private setupMessageHandler() : void {
        this.ws.on('message', (data) => {
            const parsedData = JSON.parse(data.toString());
            console.log(`Received message from user: ${parsedData}`);
            
            
            switch (parsedData.type) {
                case "join" : {
                    console.log("User joined the chat");
                    break;
                }
                case "move" : {
                    console.log("User moved to position", parsedData.data);
                    break;
                }
                default:
                    console.log("Unknown message type:", parsedData.type);
            } 
        })
    }

    private async handleJoin(parseData : any) : Promise<any>{
        const { spaceId, token} = parseData.payload;

        try {
        const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        if (!decoded.userId) {
            console.error("Invalid token");
            this.ws.close();
            return;
        }
        this.userId = decoded.id;

        const space = await client.space.findFirst({
            where : {
                id : spaceId
            },
            include : {
                map : true
            }
        })

        if(!space) {
            console.error("Space not found");
            this.ws.close();
            return;
        }

        this.spaceId = spaceId;
        RoomManager.getInstance().addUserToRoom()

    }
    }
}