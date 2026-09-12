import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DefaultEventsMap, Server } from 'socket.io';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { ServerToClientEvents } from '@project/shared';

@WebSocketGateway()
export class DutyGateway {
  @WebSocketServer()
  private readonly server: Server<DefaultEventsMap, ServerToClientEvents>;

  @OnEvent(Events.DUTY_ENDED)
  onDutyStarted(payload: EventPayload<typeof Events.DUTY_ENDED>) {}
}
