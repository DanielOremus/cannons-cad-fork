import { UnitMemberEntity } from '../../unit-member/entities/unit-member.entity.js';
import { CreateUnitDto } from '../dto/create-unit.dto.js';

export type CreateUnitInput = Pick<CreateUnitDto, 'callsign' | 'status'> & {
  members: UnitMemberEntity['id'][];
};
