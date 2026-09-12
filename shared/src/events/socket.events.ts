import type { UnitDto } from '../dto/unit/get-unit.dto.js';
import { UnitStatus } from '../types/unit.status.js';

export const SocketEvents = {
  unit: {
    joined: 'unit:joined',
    statusChanged: 'unit:status:changed',
  },
} as const;

export type ServerToClientEvents = {
  [SocketEvents.unit.joined]: (payload: UnitDto) => void;
  [SocketEvents.unit.statusChanged]: (payload: { unitId: number; status: UnitStatus }) => void;
};
