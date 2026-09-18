import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DefaultEventsMap, Server } from 'socket.io';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { Rooms } from '../../core/socket/rooms.js';
import { DutyType, ServerToClientEvents } from '@project/shared';

@WebSocketGateway()
export class UnitJoinRequestGateway {
  @WebSocketServer()
  private readonly server: Server<DefaultEventsMap, ServerToClientEvents>;

  constructor(private readonly socketSession: SocketSessionService) {}

  @OnEvent(Events.UNIT_JOIN_SENT)
  async onUnitJoinSent(payload: EventPayload<typeof Events.UNIT_JOIN_SENT>) {
    const { fromUser, toUser, requestId } = payload;

    const unitMemberRoom = Rooms.unitMember(toUser.memberId);
    this.server.to(unitMemberRoom).emit('unit:join-request:sent', {
      requestId,
      fromUser: { name: fromUser.name, memberName: fromUser.memberName },
    });
  }
  @OnEvent(Events.UNIT_JOIN_ACCEPTED)
  async onUnitJoinAccepted(payload: EventPayload<typeof Events.UNIT_JOIN_ACCEPTED>) {
    const issuerSocketId = await this.socketSession.getUserSocket(payload.userId);
    if (!issuerSocketId) return;
    const issuerSocket = this.server.sockets.sockets.get(issuerSocketId);
    if (!issuerSocket) return;

    const unitMemberRoom = Rooms.unitMember(payload.member.id);
    const unitRoom = Rooms.unit(payload.unitId);

    const roomsToJoin = [unitMemberRoom, unitRoom];
    if (payload.duty === DutyType.DISPATCH) roomsToJoin.push(Rooms.dispatch);

    issuerSocket.emit('unit:join-request:accepted');
    this.server
      .to([unitRoom, Rooms.dispatch])
      .emit('unit:member:joined', { unitId: payload.unitId, member: payload.member });
    issuerSocket.join(roomsToJoin);
  }
  @OnEvent(Events.UNIT_JOIN_DECLINED)
  async onUnitJoinDeclined(payload: EventPayload<typeof Events.UNIT_JOIN_DECLINED>) {
    const issuerSocketId = await this.socketSession.getUserSocket(payload.userId);
    if (!issuerSocketId) return;
    const issuerSocket = this.server.sockets.sockets.get(issuerSocketId);
    if (!issuerSocket) return;

    issuerSocket.emit('unit:join-request:declined');
  }
}
