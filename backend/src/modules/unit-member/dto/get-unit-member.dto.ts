import { UnitMemberDto as ReadDto } from '@project/shared';

export class UnitMemberDto implements ReadDto {
  id: number;
  name: string;
  rank: string;
  lastJoinAt: Date;
}
