import { EntityManager } from '@mikro-orm/postgresql';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleRepository } from '../vehicle.repository';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';

@Injectable()
export class OrmVehicleRepository extends VehicleRepository {
  private readonly entity = VehicleEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: VehicleEntity[]; total: number }> {
    const { limit, page } = pagination;
    const itemsPromise = this.em.find(
      this.entity,
      { owner: characterId },
      { limit, offset: (page - 1) * limit },
    );
    const countPromise = this.em.count(this.entity, { owner: characterId });

    const [vehicles, total] = await Promise.all([itemsPromise, countPromise]);

    return { items: vehicles, total };
  }
  async countByCharacter(characterId: number): Promise<number> {
    return await this.em.count(this.entity, { owner: characterId });
  }
}
