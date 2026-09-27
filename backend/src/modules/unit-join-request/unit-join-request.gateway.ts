import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { Rooms } from '../../core/socket/rooms.js';
import { BaseGateway } from '../../core/socket/base.gateway.js';

@WebSocketGateway()
export class UnitJoinRequestGateway extends BaseGateway {
  constructor(socketSession: SocketSessionService) {
    super(socketSession);
  }

  @OnEvent(Events.UNIT_JOIN_SENT)
  onUnitJoinSent(payload: EventPayload<typeof Events.UNIT_JOIN_SENT>) {
    const { fromUser, toUser, requestId } = payload;

    const unitMemberRoom = Rooms.unitMember(toUser.memberId);

    this.server.to(unitMemberRoom).emit('unit:join-request:sent', {
      requestId,
      fromUser: { name: fromUser.name, memberName: fromUser.memberName },
    });
  }
  @OnEvent(Events.UNIT_JOIN_ACCEPTED)
  async onUnitJoinAccepted(payload: EventPayload<typeof Events.UNIT_JOIN_ACCEPTED>) {
    const issuerSocket = await this.getSocket(payload.userId);
    if (!issuerSocket) return;

    issuerSocket.leave(Rooms.lobby(payload.duty));

    issuerSocket.emit('unit:join-request:accepted');
  }
  @OnEvent(Events.UNIT_JOIN_DECLINED)
  async onUnitJoinDeclined(payload: EventPayload<typeof Events.UNIT_JOIN_DECLINED>) {
    const issuerSocket = await this.getSocket(payload.userId);
    if (!issuerSocket) return;

    issuerSocket.emit('unit:join-request:declined');
  }
}
