import type { UnitMemberDto } from '../dto/unit-member/get-unit-member.dto.js';
import type { UnitDto } from '../dto/unit/get-unit.dto.js';
import { UnitStatus } from '../types/unit.status.js';

export const SocketEvents = {
  unit: {
    joined: 'unit:joined',
    statusChanged: 'unit:status:changed',
    joinRequest: {
      sent: 'unit:join-request:sent',
      accepted: 'unit:join-request:accepted',
      declined: 'unit:join-request:declined',
    },
    deleted: 'unit:deleted',
    member: {
      joined: 'unit:member:joined',
      left: 'unit:member:left',
    },
  },
} as const;

export type ServerToClientEvents = {
  [SocketEvents.unit.joined]: (payload: UnitDto) => void;
  [SocketEvents.unit.statusChanged]: (payload: { unitId: number; status: UnitStatus }) => void;
  [SocketEvents.unit.deleted]: (payload: { unitId: number }) => void;
  [SocketEvents.unit.joinRequest.sent]: (payload: {
    requestId: string;
    fromUser: { name: string; memberName: string };
  }) => void;
  [SocketEvents.unit.joinRequest.accepted]: () => void;
  [SocketEvents.unit.joinRequest.declined]: () => void;
  [SocketEvents.unit.member.left]: (payload: { memberId: number }) => void;
  [SocketEvents.unit.member.joined]: (payload: { unitId: number; member: UnitMemberDto }) => void;
};
