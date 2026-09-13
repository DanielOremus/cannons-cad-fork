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
  },
} as const;

export type ServerToClientEvents = {
  [SocketEvents.unit.joined]: (payload: UnitDto) => void;
  [SocketEvents.unit.statusChanged]: (payload: { unitId: number; status: UnitStatus }) => void;
  [SocketEvents.unit.joinRequest.sent]: (payload: {
    requestId: string;
    fromUser: { name: string; memberName: string };
  }) => void;
  [SocketEvents.unit.joinRequest.accepted]: () => void;
  [SocketEvents.unit.joinRequest.declined]: () => void;
};
