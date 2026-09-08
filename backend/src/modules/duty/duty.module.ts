import { Module } from '@nestjs/common';
import { DutyController } from './duty.controller.js';
import { DutyService } from './duty.service.js';
import { DutyGateway } from './duty.gateway.js';
import { UnitModule } from '../unit/unit.module.js';

@Module({
  imports: [UnitModule],
  controllers: [DutyController],
  providers: [DutyService, DutyGateway],
})
export class DutyModule {}
