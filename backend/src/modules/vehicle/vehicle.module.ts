import { Module } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository';
import { OrmVehicleRepository } from './infrastructure/orm.vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehicleMapper } from './vehicle.mapper';
import { VehicleController } from './vehicle.controller';
import { CharacterModule } from '../character/character.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VehicleEntity } from './entities/vehicle.entity';
import { OwnershipModule } from '../../shared/modules/ownership/ownership.module';

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
