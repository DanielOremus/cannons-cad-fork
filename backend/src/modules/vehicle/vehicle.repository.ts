import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleInput } from './inputs/create-vehicle.input';

@Injectable()
export abstract class VehicleRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: VehicleEntity[]; total: number }>;
  abstract create(input: CreateVehicleInput): Promise<VehicleEntity>;
  abstract findByLicensePlate(
    plate: string,
    populate?: VehiclePopulate[],
  ): Promise<VehicleEntity | null>;
  abstract findById(id: number, populate?: VehiclePopulate[]): Promise<VehicleEntity | null>;
  abstract delete(vehicle: VehicleEntity): Promise<void>;
}

export type VehiclePopulate = 'owner';
