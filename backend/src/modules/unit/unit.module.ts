import { Module } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { OrmUnitRepository } from './infrastructure/orm.unit.repository.js';
import { UnitService } from './unit.service.js';

@Module({
  providers: [
    {
      provide: UnitRepository,
      useClass: OrmUnitRepository,
    },
    UnitService,
  ],
})
export class UnitModule {}
