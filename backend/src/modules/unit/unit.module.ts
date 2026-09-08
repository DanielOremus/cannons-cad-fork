import { Module } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { OrmUnitRepository } from './infrastructure/orm.unit.repository.js';
import { UnitService } from './unit.service.js';
import { UnitMemberModule } from '../unit-member/unit-member.module.js';
import { UnitMapper } from './unit.mapper.js';

@Module({
  imports: [UnitMemberModule],
  providers: [
    {
      provide: UnitRepository,
      useClass: OrmUnitRepository,
    },
    UnitMapper,
    UnitService,
  ],
  exports: [],
})
export class UnitModule {}
