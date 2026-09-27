import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { Rooms } from '../../core/socket/rooms.js';
import { BaseGateway } from '../../core/socket/base.gateway.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { joinUnitLobbySchema, LiveDuty, SocketEvents } from '@project/shared';
import { type AppSocket } from '../../shared/types/socket.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { getContextsOrThrow } from '../../shared/utils/permission.helpers.js';
import { ForbiddenError } from '../../shared/errors/app.error.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';

@WebSocketGateway()
export class UnitGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }

  @SubscribeMessage(SocketEvents.unit.joinLobby)
  @RequirePermission('duty', 'start')
  onLobbyJoin(
    @MessageBody(new ZodValidationPipe(joinUnitLobbySchema)) duty: LiveDuty,
    @ConnectedSocket() socket: AppSocket,
  ) {
    const contexts = getContextsOrThrow(socket.data.permissionMeta!);
    if (!contexts.includes(duty)) throw new ForbiddenError(`Cannot join '${duty}' lobby`);

    socket.join(Rooms.lobby(duty));
  }

  @OnEvent(Events.UNIT_CREATED)
  onUnitCreated(payload: EventPayload<typeof Events.UNIT_CREATED>) {
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
