import { Module } from '@nestjs/common';
import { RedisModule } from '../../core/redis/redis.module.js';
import { UnitJoinRequestService } from './unit-join-request.service.js';
import { UnitJoinRequestController } from './unit-join-request.controller.js';
import { UnitModule } from '../unit/unit.module.js';
import { UnitMemberModule } from '../unit-member/unit-member.module.js';
import { UnitJoinRequestGateway } from './unit-join-request.gateway.js';

@Module({
  imports: [RedisModule, UnitModule, UnitMemberModule],
  controllers: [UnitJoinRequestController],
  providers: [UnitJoinRequestService, UnitJoinRequestGateway],
})
export class UnitJoinRequestModule {}
