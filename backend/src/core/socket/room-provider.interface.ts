export interface IRoomProvider {
  getRoomsForUser(userId: string): Promise<string[]>;
}

export const ROOM_PROVIDER = Symbol('ROOM_PROVIDER');
