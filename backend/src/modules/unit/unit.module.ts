import { Module } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { OrmUnitRepository } from './infrastructure/orm.unit.repository.js';
import { UnitService } from './unit.service.js';
import { UnitMemberModule } from '../unit-member/unit-member.module.js';
import { UnitMapper } from './unit.mapper.js';
import { UnitController } from './unit.controller.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UnitEntity } from './entities/unit.entity.js';
import { UnitGateway } from './unit.gateway.js';
import { ROOM_PROVIDER } from '../../core/socket/room-provider.interface.js';
import { UnitSessionService } from './unit-session.service.js';

@Module({
  imports: [UnitMemberModule, MikroOrmModule.forFeature([UnitEntity])],
  controllers: [UnitController],
  providers: [
    {
      provide: UnitRepository,
      useClass: OrmUnitRepository,
    },
    { provide: ROOM_PROVIDER, useClass: UnitSessionService },
    UnitMapper,
    UnitService,
    UnitGateway,
  ],
  exports: [UnitRepository, ROOM_PROVIDER],
})
export class UnitModule {}
