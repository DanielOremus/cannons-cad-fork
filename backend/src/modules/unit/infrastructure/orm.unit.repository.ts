import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitEntity } from '../entities/unit.entity.js';
import { UnitPopulate, UnitRepository } from '../unit.repository.js';
import { CreateUnitDto } from '../dto/create-unit.dto.js';

export class OrmUnitRepository implements UnitRepository {
  private readonly entity = UnitEntity;
  constructor(private readonly em: EntityManager) {}
  async findMany(populate: UnitPopulate[] = ['members']): Promise<UnitEntity[]> {
    return await this.em.findAll(this.entity, { populate });
  }
  async create(input: CreateUnitDto): Promise<UnitEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: UnitEntity, input: object): Promise<UnitEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(entity: UnitEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
