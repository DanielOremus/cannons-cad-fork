import { Injectable } from '@nestjs/common';
import { CreateUnitMemberInput } from './inputs/create-unit-member.input.js';
import { UnitMemberEntity } from './entities/unit-member.entity.js';
import { UpdateUnitMemberInput } from './inputs/update-unit-member.input.js';

@Injectable()
export abstract class UnitMemberRepository {
  abstract create(input: CreateUnitMemberInput): Promise<UnitMemberEntity>;
  abstract findByUser(
    userId: string,
    populate?: UnitMemberPopulate[],
  ): Promise<UnitMemberEntity | null>;
  abstract findById(id: number): Promise<UnitMemberEntity | null>;
  abstract findLeader(unitId: number): Promise<UnitMemberEntity | null>;
  abstract update(
    entity: UnitMemberEntity,
    input: UpdateUnitMemberInput,
  ): Promise<UnitMemberEntity>;
}

export type UnitMemberPopulate = 'user' | 'unit';
