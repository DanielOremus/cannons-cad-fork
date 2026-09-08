import { Injectable } from '@nestjs/common';
import { CreateUnitMemberInput } from './inputs/create-unit-member.input.js';
import { UnitMemberEntity } from './entities/unit-member.entity.js';

@Injectable()
export abstract class UnitMemberRepository {
  abstract create(input: CreateUnitMemberInput): Promise<UnitMemberEntity>;
  abstract findByUserId(userId: string): Promise<UnitMemberEntity | null>;
  //   abstract update(entity: UnitEntity, input: object): Promise<UnitEntity>;
}
