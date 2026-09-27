import { LiveDuty } from '@project/shared';
import { UnitEntity } from '../../src/modules/unit/entities/unit.entity.js';
import { CreateUnitInput } from '../../src/modules/unit/inputs/create-unit.input.js';
import { BaseFactory } from './base.factory.js';

export class UnitFactory extends BaseFactory {
  async create(duty: LiveDuty, override: Partial<CreateUnitInput> = {}) {
    const unit = await this.em.create(UnitEntity, {
      duty,
      ...override,
    });
    await this.em.flush();
    return unit;
  }
}
