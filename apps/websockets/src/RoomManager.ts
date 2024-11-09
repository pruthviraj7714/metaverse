import type { User } from "./UserManager";

export class RoomManager {
  private static instance: RoomManager;
  public rooms: Map<string, User[]>;

  private constructor() {
    this.rooms = new Map();
  }

  static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public addUser(spaceId: string, user: User): void {
    const users = this.rooms.get(spaceId) ?? [];
    this.rooms.set(spaceId, [...users, user]);
  }

  public removeUser(user: User, spaceId: string): void {
    const users = this.rooms.get(spaceId);
    if (!users) return;

    const updatedUsers = users.filter((u) => u.userId !== user.userId);
    if (updatedUsers.length > 0) {
      this.rooms.set(spaceId, updatedUsers);
    } else {
      this.rooms.delete(spaceId);
    }
  }

  public broadcast(message: any, user: User, roomId: string): void {
    const users = this.rooms.get(roomId);
    if (!users) return;

    users.forEach((u: any) => {
      if (u.userId !== user.userId) {
        u.send(message);
      }
    });
  }
}
