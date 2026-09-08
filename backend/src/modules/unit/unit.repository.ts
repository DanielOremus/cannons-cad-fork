import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UnitEntity } from './entities/unit.entity.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class UnitRepository {
  abstract findMany(populate?: UnitPopulate[]): Promise<UnitEntity[]>;
  abstract create(input: CreateUnitDto): Promise<UnitEntity>;
  abstract update(entity: UnitEntity, input: object): Promise<UnitEntity>;
  abstract delete(entity: UnitEntity): Promise<void>;
}

export type UnitPopulate = 'members';
