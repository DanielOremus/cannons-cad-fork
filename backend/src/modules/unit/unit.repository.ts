import { UnitEntity } from './entities/unit.entity.js';
import { Injectable } from '@nestjs/common';
import { CreateUnitInput } from './inputs/create-unit.input.js';
import { UnitsFilterDto } from './dto/get-units-filter.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';

@Injectable()
export abstract class UnitRepository {
  abstract findMany(query: UnitsFilterDto, populate?: UnitPopulate[]): Promise<UnitEntity[]>;
  abstract findById(id: number, populate?: UnitPopulate[]): Promise<UnitEntity | null>;
  abstract countMembers(entity: UnitEntity): Promise<number>;
  abstract create(input: CreateUnitInput): Promise<UnitEntity>;
  abstract update(entity: UnitEntity, input: UpdateUnitDto): Promise<UnitEntity>;
  abstract delete(entity: UnitEntity): Promise<void>;
}

export type UnitPopulate = 'members';
