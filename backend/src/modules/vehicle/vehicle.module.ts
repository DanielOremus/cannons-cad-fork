import { Module } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository.js';
import { OrmVehicleRepository } from './infrastructure/orm.vehicle.repository.js';
import { VehicleService } from './vehicle.service.js';
import { VehicleMapper } from './vehicle.mapper.js';
import { VehicleController } from './vehicle.controller.js';
import { CharacterModule } from '../character/character.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VehicleEntity } from './entities/vehicle.entity.js';
import { OwnershipModule } from '../../shared/modules/ownership/ownership.module.js';

@Module({
  imports: [MikroOrmModule.forFeature([VehicleEntity]), CharacterModule, OwnershipModule],
  controllers: [VehicleController],
  providers: [
    { provide: VehicleRepository, useClass: OrmVehicleRepository },
    VehicleService,
    VehicleMapper,
  ],
  exports: [VehicleRepository],
})
export class VehicleModule {}
