import { Injectable } from '@nestjs/common';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehicleDto } from './dto/get-vehicle.dto';

@Injectable()
export class VehicleMapper {
  // constructor(private readonly )
  toReadDto(vehicle: VehicleEntity): VehicleDto {
    const { owner, color, flags, id, licensePlate, make, model, type, year } = vehicle;
    return {
      owner: { id: owner.id, firstName: owner.firstName, lastName: owner.lastName },
      color,
      flags,
      id,
      licensePlate,
      make,
      model,
      type,
      year,
    };
  }
  toDtoList(vehicles: VehicleEntity[]): VehicleDto[] {
    return vehicles.map((v) => this.toReadDto(v));
  }
}
