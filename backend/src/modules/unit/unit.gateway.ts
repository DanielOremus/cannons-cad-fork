import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { type EventPayload, Events } from '../../shared/constants/events.js';

@WebSocketGateway()
export class UnitGateway {
  @WebSocketServer()
  private readonly server: Server;

  @OnEvent(Events.UNIT_STATUS_UPDATED)
  onUnitStatusUpdated(payload: EventPayload<typeof Events.UNIT_STATUS_UPDATED>) {
    this.server.to('').emit('unit:status:updated', payload);
  }
}
