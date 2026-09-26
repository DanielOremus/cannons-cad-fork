import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AppConfigService } from '../config/config.service.js';
import { type AppSocket } from '../../shared/types/socket.js';

@WebSocketGateway()
export class DebugGateway {
  constructor(private readonly config: AppConfigService) {}

  @SubscribeMessage('debug:join-room')
  handleDebugJoin(@MessageBody() data: { room: string }, @ConnectedSocket() socket: AppSocket) {
    if (this.config.env === 'production') return;
    socket.join(data.room);
    socket.emit('debug:joined', { room: data.room });
  }

  //TODO: subscribe to lobby:join
}
