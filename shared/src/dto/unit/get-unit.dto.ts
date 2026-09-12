import type { LiveDuty } from '../../types/duty.type.js';
import type { UnitStatus } from '../../types/unit.status.js';
import type { UnitMemberDto } from '../unit-member/get-unit-member.dto.js';

export type UnitDto = {
  id: number;
  callsign?: string | null;
  duty: LiveDuty;
  status: UnitStatus;
  members: UnitMemberDto[];
};
