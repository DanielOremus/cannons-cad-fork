import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { Rooms } from '../../core/socket/rooms.js';
import { BaseGateway } from '../../core/socket/base.gateway.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';

@WebSocketGateway()
export class UnitGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }

  @OnEvent(Events.UNIT_CREATED)
  async onUnitCreated(payload: EventPayload<typeof Events.UNIT_CREATED>) {
    const roomsToEmit = [Rooms.dispatch, Rooms.lobby(payload.unit.duty)];
    this.server.to(roomsToEmit).emit('unit:created', payload.unit);
  }
  @OnEvent(Events.UNIT_UPDATED)
  onUnitUpdated(payload: EventPayload<typeof Events.UNIT_UPDATED>) {
    const unitRoom = Rooms.unit(payload.id);
    this.server.to([unitRoom, Rooms.dispatch]).emit('unit:updated', payload);
  }
  @OnEvent(Events.UNIT_DELETED)
  onUnitDeleted(payload: EventPayload<typeof Events.UNIT_DELETED>) {
    this.server
      .to([Rooms.dispatch, Rooms.lobby(payload.duty)])
      .emit('unit:deleted', { unitId: payload.id });
  }
}
