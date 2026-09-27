import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitMemberEntity } from '../entities/unit-member.entity.js';
import { UnitMemberPopulate, UnitMemberRepository } from '../unit-member.repository.js';
import { CreateUnitMemberInput } from '../inputs/create-unit-member.input.js';
import { UpdateUnitMemberInput } from '../inputs/update-unit-member.input.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmUnitMemberRepository implements UnitMemberRepository {
  private readonly entity = UnitMemberEntity;
  constructor(private readonly em: EntityManager) {}
  async create(input: CreateUnitMemberInput): Promise<UnitMemberEntity> {
    return await this.em.create(this.entity, input);
  }
  async findByUser(
    userId: string,
    populate: UnitMemberPopulate[] = [],
  ): Promise<UnitMemberEntity | null> {
    return await this.em.findOne(this.entity, { user: userId }, { populate });
  }
  async findById(id: number): Promise<UnitMemberEntity | null> {
    return await this.em.findOne(this.entity, { id });
  }
  async findLeader(unitId: number) {
    const [leader] = await this.em.find(
      this.entity,
      { unit: unitId, lastJoinAt: { $ne: null } },
      { orderBy: { lastJoinAt: 'ASC' }, limit: 1 },
    );
    return leader ?? null;
  }
  async update(entity: UnitMemberEntity, input: UpdateUnitMemberInput): Promise<UnitMemberEntity> {
    return await wrap(entity).assign(input);
  }
}
