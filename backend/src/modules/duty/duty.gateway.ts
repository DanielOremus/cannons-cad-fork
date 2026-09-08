import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { type EventPayload, Events } from '../../shared/constants/events.js';

@WebSocketGateway()
export class DutyGateway {
  @WebSocketServer()
  private readonly server: Server;

  @OnEvent(Events.DUTY_STARTED)
  onDutyStarted(payload: EventPayload<typeof Events.DUTY_STARTED>) {}
}
