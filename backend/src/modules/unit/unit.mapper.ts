import { Injectable } from '@nestjs/common';
import { UnitEntity } from './entities/unit.entity.js';
import { UnitMemberMapper } from '../unit-member/unit-member.mapper.js';
import { UnitDto } from './dto/get-unit.dto.js';

@Injectable()
export class UnitMapper {
  constructor(private readonly unitMemberMapper: UnitMemberMapper) {}
  toReadDto(unit: UnitEntity): UnitDto {
    const { id, callsign, status, members, duty } = unit;
    return {
      id,
      callsign,
      duty,
      status,
      members: this.unitMemberMapper.toListDto(Array.from(members)),
    };
  }
  toListDto(units: UnitEntity[]): UnitDto[] {
    return units.map((u) => this.toReadDto(u));
  }
}
