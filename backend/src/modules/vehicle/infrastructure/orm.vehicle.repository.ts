import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehiclePopulate, VehicleRepository } from '../vehicle.repository';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { CreateVehicleInput } from '../inputs/create-vehicle.input';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Injectable()
export class OrmVehicleRepository implements VehicleRepository {
  private readonly entity = VehicleEntity;
  constructor(private readonly em: EntityManager) {}
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
  async findByLicensePlate(
    plate: string,
    populate?: VehiclePopulate[],
  ): Promise<VehicleEntity | null> {
    return await this.em.findOne(this.entity, { licensePlate: plate }, { populate });
  }
  async findById(id: number, populate?: VehiclePopulate[]): Promise<VehicleEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }

  async create(input: CreateVehicleInput): Promise<VehicleEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(vehicle: VehicleEntity, input: UpdateVehicleDto): Promise<VehicleEntity> {
    return await wrap(vehicle).assign(input);
  }
  async delete(vehicle: VehicleEntity): Promise<void> {
    await this.em.remove(vehicle);
  }
}
