import { Module } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository';
import { OrmVehicleRepository } from './infrastructure/orm.vehicle.repositry';

@Module({
  providers: [{ provide: VehicleRepository, useClass: OrmVehicleRepository }],
  exports: [VehicleRepository],
})
export class VehicleModule {}
