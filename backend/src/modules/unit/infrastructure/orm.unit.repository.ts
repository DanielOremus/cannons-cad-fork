import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitEntity } from '../entities/unit.entity.js';
import { UnitRepository } from '../unit.repository.js';

export class OrmUnitRepository implements UnitRepository {
  private readonly entity = UnitEntity;
  constructor(private readonly em: EntityManager) {}
  async findMany(): Promise<UnitEntity[]> {
    return await this.em.findAll(this.entity);
  }
  async update(entity: UnitEntity, input: object): Promise<UnitEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(entity: UnitEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
