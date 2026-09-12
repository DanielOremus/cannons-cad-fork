import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitMemberEntity } from '../entities/unit-member.entity.js';
import { UnitMemberRepository } from '../unit-member.repository.js';
import { CreateUnitMemberInput } from '../inputs/create-unit-member.input.js';
import { UpdateUnitMemberInput } from '../inputs/update-unit-member.input.js';

export class OrmUnitMemberRepository implements UnitMemberRepository {
  private readonly entity = UnitMemberEntity;
  constructor(private readonly em: EntityManager) {}
  async create(input: CreateUnitMemberInput): Promise<UnitMemberEntity> {
    return await this.em.create(this.entity, input);
    // return await this.em.create(this.entity, input);
  }
  async findByUserId(userId: string): Promise<UnitMemberEntity | null> {
    return await this.em.findOne(this.entity, { user: userId });
  }
  async findById(id: number): Promise<UnitMemberEntity | null> {
    return await this.em.findOne(this.entity, { id });
  }
  async update(entity: UnitMemberEntity, input: UpdateUnitMemberInput): Promise<UnitMemberEntity> {
    return await wrap(entity).assign(input);
  }
}
