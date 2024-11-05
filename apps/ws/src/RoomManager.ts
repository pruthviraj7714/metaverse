import type { User } from "./UserManager";

export class RoomManager{
    public rooms : Map<String, User[]>;
    public static instance : RoomManager;

    private constructor() {
        this.rooms = new Map<String, User[]>();
    }

    static getInstance() {
        if(!this.instance) {
            return new RoomManager();
        }
        return this.instance;
    }


    public addUserToRoom(userId : string, roomId : string) : void {
        if(!this.rooms.has(roomId)) {
            return;
        }
        this.rooms.set(roomId, [...this.rooms.get(roomId) ?? [],userId]);

    }
    

}