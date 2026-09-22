import { WebSocketGateway } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseGateway } from '../../core/socket/base.gateway.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { type EventPayload, Events } from '../../shared/constants/events.js';

@WebSocketGateway()
export class UserGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }

  @OnEvent(Events.USER_STATUS_CHANGED)
  async onUserStatusChanged(payload: EventPayload<typeof Events.USER_STATUS_CHANGED>) {
    const socket = await this.getSocket(payload.userId);
    if (!socket) return;

    this.server.emit('user:status:changed');
    socket.disconnect(true);
  }
  @OnEvent(Events.USER_ROLES_CHANGED)
  async onUserPermissionsChanged(payload: EventPayload<typeof Events.USER_ROLES_CHANGED>) {
    const socket = await this.getSocket(payload.userId);
    if (!socket) return;

    this.server.emit('user:roles:changed');
    socket.disconnect(true);
  }
}
