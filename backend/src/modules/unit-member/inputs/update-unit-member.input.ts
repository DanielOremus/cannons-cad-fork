import { UnitEntity } from '../../unit/entities/unit.entity.js';
import { UpdateUnitMemberDto } from '../dto/update-unit-member.dto.js';
import { UnitMemberEntity } from '../entities/unit-member.entity.js';

export type UpdateUnitMemberInput = UpdateUnitMemberDto & {
  lastJoinAt?: UnitMemberEntity['lastJoinAt'];
  unit?: UnitEntity['id'];
};
