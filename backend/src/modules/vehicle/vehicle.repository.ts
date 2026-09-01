import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { VehicleEntity } from './entities/vehicle.entity.js';
import { CreateVehicleInput } from './inputs/create-vehicle.input.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';

@Injectable()
export abstract class VehicleRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: VehicleEntity[]; total: number }>;
  abstract findByLicensePlate(
    plate: string,
    populate?: VehiclePopulate[],
  ): Promise<VehicleEntity | null>;
  abstract findById(id: number, populate?: VehiclePopulate[]): Promise<VehicleEntity | null>;
  abstract create(input: CreateVehicleInput): Promise<VehicleEntity>;
  abstract update(vehicle: VehicleEntity, input: UpdateVehicleDto): Promise<VehicleEntity>;
  abstract delete(vehicle: VehicleEntity): Promise<void>;
}

export type VehiclePopulate = 'owner';
