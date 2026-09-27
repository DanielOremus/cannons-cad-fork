import { Module } from '@nestjs/common';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { OrmUnitMemberRepository } from './infrastructure/orm.unit-member.repository.js';
import { UnitMemberMapper } from './unit-member.mapper.js';
import { UnitMemberService } from './unit-member.service.js';
import { UnitMemberController } from './unit-member.controller.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UnitMemberEntity } from './entities/unit-member.entity.js';
import { UnitMemberGateway } from './unit-member.gateway.js';
@Module({
  imports: [MikroOrmModule.forFeature([UnitMemberEntity])],
  controllers: [UnitMemberController],
  providers: [
    {
      provide: UnitMemberRepository,
      useClass: OrmUnitMemberRepository,
    },
    UnitMemberGateway,
    UnitMemberService,
    UnitMemberMapper,
  ],
  exports: [UnitMemberRepository, UnitMemberMapper],
})
export class UnitMemberModule {}
