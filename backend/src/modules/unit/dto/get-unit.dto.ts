import { UnitDto as ReadDto, UnitMemberDto, UnitStatus } from '@project/shared';

export class UnitDto implements ReadDto {
  id: number;
  callsign: string;
  status: UnitStatus;
  members: UnitMemberDto[];
}
