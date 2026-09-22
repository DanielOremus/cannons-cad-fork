import type { UnitMemberDto } from '../dto/unit-member/get-unit-member.dto.js';
import type { UnitDto } from '../dto/unit/get-unit.dto.js';
import type { UpdateUnitResponseDto } from '../dto/unit/update-unit.dto.js';
import { UnitStatus } from '../types/unit.status.js';

export const SocketEvents = {
  unit: {
    created: 'unit:created',
    updated: 'unit:updated',
    deleted: 'unit:deleted',
    joinRequest: {
      sent: 'unit:join-request:sent',
      accepted: 'unit:join-request:accepted',
      declined: 'unit:join-request:declined',
    },
    member: {
      joined: 'unit:member:joined',
      left: 'unit:member:left',
    },
  },
} as const;

export type ServerToClientEvents = {
  [SocketEvents.unit.created]: (payload: UnitDto) => void;
  [SocketEvents.unit.updated]: (payload: UpdateUnitResponseDto) => void;
  [SocketEvents.unit.deleted]: (payload: { unitId: number }) => void;
  [SocketEvents.unit.joinRequest.sent]: (payload: {
    requestId: string;
    fromUser: { name: string; memberName: string };
  }) => void;
  [SocketEvents.unit.joinRequest.accepted]: () => void;
  [SocketEvents.unit.joinRequest.declined]: () => void;
  [SocketEvents.unit.member.left]: (payload: { unitId: number; memberId: number }) => void;
  [SocketEvents.unit.member.joined]: (payload: { unitId: number; member: UnitMemberDto }) => void;
};
