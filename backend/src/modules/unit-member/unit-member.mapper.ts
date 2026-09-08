import { Injectable } from '@nestjs/common';
import { UnitMemberEntity } from './entities/unit-member.entity.js';
import { UnitMemberDto } from './dto/get-unit-member.dto.js';

@Injectable()
export class UnitMemberMapper {
  toReadDto(member: UnitMemberEntity): UnitMemberDto {
    const { id, name, rank, lastJoinAt } = member;
    return {
      id,
      name,
      rank,
      lastJoinAt,
    };
  }
  toListDto(members: UnitMemberEntity[]): UnitMemberDto[] {
    return members.map((m) => this.toReadDto(m));
  }
}
