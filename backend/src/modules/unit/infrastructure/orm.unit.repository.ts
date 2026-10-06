import { EntityManager } from '@mikro-orm/postgresql';
import { UnitEntity } from '../entities/unit.entity.js';
import { UnitFindManyFilters, UnitPopulate, UnitRepository } from '../unit.repository.js';
import { CreateUnitInput } from '../inputs/create-unit.input.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmUnitRepository implements UnitRepository {
  private readonly entity = UnitEntity;
  constructor(private readonly em: EntityManager) {}
  async findMany(
    filters: UnitFindManyFilters,
    populate: UnitPopulate[] = [],
  ): Promise<UnitEntity[]> {
    return await this.em.findAll(this.entity, {
      where: {
        ...(filters.duty && { duty: filters.duty }),
        ...(filters.ids && filters.ids.length > 0 && { id: { $in: filters.ids } }),
      },
      populate,
    });
  }
  async findById(id: number, populate: UnitPopulate[] = []): Promise<UnitEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }
  async countMembers(entity: UnitEntity): Promise<number> {
    return await entity.members.loadCount();
  }
  async create(input: CreateUnitInput): Promise<UnitEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: UnitEntity, input: object): Promise<UnitEntity> {
    return await this.em.assign(entity, input);
  }
  async delete(entity: UnitEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
