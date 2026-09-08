import type { UnitStatus } from '../../types/unit.status.js';
import type { UnitMemberDto } from './get-unit-member.dto.js';

export type UnitDto = {
  id: number;
  callsign: string;
  status: UnitStatus;
  members: UnitMemberDto[];
};
