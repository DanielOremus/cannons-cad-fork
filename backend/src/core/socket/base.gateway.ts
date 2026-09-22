import { WebSocketServer } from '@nestjs/websockets';
import { ServerToClientEvents } from '@project/shared';
import { DefaultEventsMap, Server } from 'socket.io';
import { SocketSessionService } from './socket-session.service.js';

export abstract class BaseGateway {
  @WebSocketServer()
  protected readonly server: Server<DefaultEventsMap, ServerToClientEvents>;

  constructor(protected readonly socketSession: SocketSessionService) {}

  protected async getSocket(userId: string) {
    const socketId = await this.socketSession.getUserSocket(userId);
    if (!socketId) return null;
    return this.server.sockets.sockets.get(socketId) ?? null;
  }
}
