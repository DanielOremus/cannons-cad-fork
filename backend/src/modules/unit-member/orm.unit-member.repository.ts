import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitMemberEntity } from './entities/unit-member.entity.js';
import { UnitMemberRepository } from './unit-member.repository.js';
import { CreateUnitMemberInput } from './inputs/create-unit-member.input.js';

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
  //   async update(entity: UnitEntity, input: object): Promise<typeof this.entity> {
  //     return await wrap(entity).assign(input);
  //   }
  //   async delete(entity: UnitEntity): Promise<void> {
  //     await this.em.remove(entity);
  //   }
}
