import { UnitEntity } from './entities/unit.entity.js';
import { Injectable } from '@nestjs/common';
import { CreateUnitInput } from './inputs/create-unit.input.js';
import { UnitsFilterDto } from './dto/get-units-filter.dto.js';

@Injectable()
export abstract class UnitRepository {
  abstract findMany(query: UnitsFilterDto, populate?: UnitPopulate[]): Promise<UnitEntity[]>;
  abstract create(input: CreateUnitInput): Promise<UnitEntity>;
  abstract update(entity: UnitEntity, input: object): Promise<UnitEntity>;
  abstract delete(entity: UnitEntity): Promise<void>;
}

export type UnitPopulate = 'members';
