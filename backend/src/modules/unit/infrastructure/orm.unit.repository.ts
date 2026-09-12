import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { UnitEntity } from '../entities/unit.entity.js';
import { UnitPopulate, UnitRepository } from '../unit.repository.js';
import { CreateUnitInput } from '../inputs/create-unit.input.js';
import { UnitsFilterDto } from '../dto/get-units-filter.dto.js';

export class OrmUnitRepository implements UnitRepository {
  private readonly entity = UnitEntity;
  constructor(private readonly em: EntityManager) {}
  async findMany(
    query: UnitsFilterDto,
    populate: UnitPopulate[] = ['members'],
  ): Promise<UnitEntity[]> {
    return await this.em.findAll(this.entity, { where: query, populate });
  }
  async create(input: CreateUnitInput): Promise<UnitEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: UnitEntity, input: object): Promise<UnitEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(entity: UnitEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
