import { Module } from '@nestjs/common';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { OrmUnitMemberRepository } from './infrastructure/orm.unit-member.repository.js';
import { UnitMemberMapper } from './unit-member.mapper.js';
import { UnitMemberService } from './unit-member.service.js';
@Module({
  providers: [
    {
      provide: UnitMemberRepository,
      useClass: OrmUnitMemberRepository,
    },
    UnitMemberService,
    UnitMemberMapper,
  ],
  exports: [UnitMemberRepository, UnitMemberMapper],
})
export class UnitMemberModule {}
