import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { VehicleEntity } from './entities/vehicle.entity';

@Injectable()
export abstract class VehicleRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: VehicleEntity[]; total: number }>;
  abstract countByCharacter(characterId: number): Promise<number>;
}
