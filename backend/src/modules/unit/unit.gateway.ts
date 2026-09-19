import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DefaultEventsMap, Server } from 'socket.io';
import { type EventPayload, Events } from '../../shared/constants/events.js';
import { SocketSessionService } from '../../core/socket/socket-session.service.js';
import { Rooms } from '../../core/socket/rooms.js';
import { DutyType, ServerToClientEvents } from '@project/shared';

@WebSocketGateway()
export class UnitGateway {
  @WebSocketServer()
  private readonly server: Server<DefaultEventsMap, ServerToClientEvents>;

  constructor(private readonly socketSession: SocketSessionService) {}

  @OnEvent(Events.UNIT_UPDATED)
  onUnitUpdated(payload: EventPayload<typeof Events.UNIT_UPDATED>) {
    const unitRoom = Rooms.unit(payload.id);
    this.server.to([unitRoom, Rooms.dispatch]).emit('unit:updated', payload);
  }
  @OnEvent(Events.UNIT_CREATED)
  async onUnitCreated(payload: EventPayload<typeof Events.UNIT_CREATED>) {
    const socketId = await this.socketSession.getUserSocket(payload.userId);
    if (!socketId) return;
    const socket = this.server.sockets.sockets.get(socketId);
    if (!socket) return;

    const unitMemberRoom = Rooms.unitMember(payload.unit.members[0].id);
    const unitRoom = Rooms.unit(payload.unit.id);

    const roomsToJoin = [unitMemberRoom, unitRoom];
    if (payload.unit.duty === DutyType.DISPATCH) roomsToJoin.push(Rooms.dispatch);
    //broadcast for dispatches and units (updates invitation list)
    const roomsToInform: string[] = [Rooms.dispatch];
    if (payload.unit.duty === DutyType.POLICE) roomsToInform.push(Rooms.police);
    if (payload.unit.duty === DutyType.EMS) roomsToInform.push(Rooms.ems);
    //add duty type check
    this.server.to(roomsToInform).emit('unit:joined', payload.unit);
    socket.join(roomsToJoin);
  }
  @OnEvent(Events.UNIT_DELETED)
  onUnitDeleted(payload: EventPayload<typeof Events.UNIT_DELETED>) {
    this.server.to(Rooms.dispatch).emit('unit:deleted', { unitId: payload.id });
  }
  @OnEvent(Events.UNIT_MEMBER_LEFT)
  async onUnitMemberLeft(payload: EventPayload<typeof Events.UNIT_MEMBER_LEFT>) {
    const unitRoom = Rooms.unit(payload.unitId);
    this.server
      .to([unitRoom, Rooms.dispatch])
      .emit('unit:member:left', { memberId: payload.memberId });

    const socketId = await this.socketSession.getUserSocket(payload.userId);
    if (!socketId) return;
    const socket = this.server.sockets.sockets.get(socketId);
    if (!socket) return;

    socket.disconnect(true);
  }
}
