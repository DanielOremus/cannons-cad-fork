import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from '../../core/socket/base.gateway.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';

@WebSocketGateway()
export class IncidentGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }
}
