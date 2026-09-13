import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { UnitMemberEntity } from '../../unit-member/entities/unit-member.entity.js';
import { LiveDuty, UnitStatus } from '@project/shared';

export const UnitSchema = defineEntity({
  name: 'Unit',
  extends: BaseSchema,
  properties: {
    duty: p.enum(LiveDuty),
    callsign: p.string().nullable(),
    status: p.enum(() => UnitStatus).default(UnitStatus.OFF_SERVICE),
    members: () => p.oneToMany(UnitMemberEntity).mappedBy('unit'),
  },
});

export class UnitEntity extends UnitSchema.class {}
UnitSchema.setClass(UnitEntity);
