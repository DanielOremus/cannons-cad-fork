import { UnitEntity } from './entities/unit.entity.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class UnitRepository {
  abstract findMany(): Promise<UnitEntity[]>;
  abstract update(entity: UnitEntity, input: object): Promise<UnitEntity>;
  abstract delete(entity: UnitEntity): Promise<void>;
}
