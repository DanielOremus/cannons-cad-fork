import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';
import { DutyType } from '@project/shared';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { Rooms } from '../../core/socket/rooms.js';
import { BaseGateway } from '../../core/socket/base.gateway.js';

@WebSocketGateway()
export class UnitMemberGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }

  @OnEvent(Events.UNIT_MEMBER_JOINED)
  async onUnitMemberJoined(payload: EventPayload<typeof Events.UNIT_MEMBER_JOINED>) {
    const unitMemberRoom = Rooms.unitMember(payload.member.id);
    const unitRoom = Rooms.unit(payload.unitId);

    const roomsToJoin = [unitMemberRoom, unitRoom];
    if (payload.duty === DutyType.DISPATCH) roomsToJoin.push(Rooms.dispatch);

    this.server
      .to([unitRoom, Rooms.dispatch])
      .emit('unit:member:joined', { unitId: payload.unitId, member: payload.member });

    const issuerSocket = await this.getSocket(payload.userId);
    if (issuerSocket) issuerSocket.join(roomsToJoin);
  }
  @OnEvent(Events.UNIT_MEMBER_LEFT)
  async onUnitMemberLeft(payload: EventPayload<typeof Events.UNIT_MEMBER_LEFT>) {
    const socket = await this.getSocket(payload.userId);
    if (socket) socket.disconnect(true);

    const unitRoom = Rooms.unit(payload.unitId);
    this.server
      .to([unitRoom, Rooms.dispatch])
      .emit('unit:member:left', { unitId: payload.unitId, memberId: payload.memberId });
  }
}
