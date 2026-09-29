import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { UnitMemberEntity } from '../../unit-member/entities/unit-member.entity.js';
import { LiveDuty, UnitStatus } from '@project/shared';
import { IncidentEntity } from '../../incident/entities/incident.entity.js';

export const UnitSchema = defineEntity({
  name: 'Unit',
  extends: BaseSchema,
  properties: {
    duty: p.enum(LiveDuty),
    callsign: p.string().nullable(),
    status: p.enum(() => UnitStatus).default(UnitStatus.OFF_SERVICE),
    members: () => p.oneToMany(UnitMemberEntity).mappedBy('unit'),
    incident: () =>
      p.manyToOne(IncidentEntity).inversedBy('attachedUnits').nullable().deleteRule('set null'),
  },
});

export class UnitEntity extends UnitSchema.class {}
UnitSchema.setClass(UnitEntity);
