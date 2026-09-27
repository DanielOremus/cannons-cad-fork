import { DefaultEventsMap, Socket } from 'socket.io';
import { PermissionMeta, ServerToClientEvents } from '@project/shared';
import { AuthUser } from './user.js';

export type SocketData = {
  user?: AuthUser;
  permissionMeta?: PermissionMeta;
};

export type AppSocket = Socket<
  DefaultEventsMap,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;
