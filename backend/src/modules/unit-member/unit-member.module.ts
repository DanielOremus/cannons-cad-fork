import { Module } from '@nestjs/common';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { OrmUnitMemberRepository } from '../unit-member/orm.unit-member.repository.js';
import { UnitMemberMapper } from './unit-member.mapper.js';
@Module({
  providers: [
    {
      provide: UnitMemberRepository,
      useClass: OrmUnitMemberRepository,
    },
    UnitMemberMapper,
  ],
  exports: [UnitMemberRepository, UnitMemberMapper],
})
export class UnitMemberModule {}
