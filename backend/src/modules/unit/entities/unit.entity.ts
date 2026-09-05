import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { UnitMemberEntity } from './unit-member.entity.js';
import { UnitStatus } from '@project/shared';

export const UnitSchema = defineEntity({
  name: 'Unit',
  extends: BaseSchema,
  properties: {
    callsign: p.string(),
    status: p.enum(() => UnitStatus).default(UnitStatus.OFF_SERVICE),
    members: () => p.oneToMany(UnitMemberEntity),
  },
});

export class UnitEntity extends UnitSchema.class {}
UnitSchema.setClass(UnitEntity);
