import { LiveDuty, UnitDto as ReadDto, UnitMemberDto, UnitStatus } from '@project/shared';

export class UnitDto implements ReadDto {
  id: number;
  callsign?: string | null;
  duty: LiveDuty;
  status: UnitStatus;
  members: UnitMemberDto[];
}
