import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { IncidentOrigin, IncidentPriority, IncidentStatus } from '@project/shared';
import { IncidentNoteEntity } from './incident-note.entity.js';
import { UnitEntity } from '../../unit/entities/unit.entity.js';

export const IncidentSchema = defineEntity({
  name: 'Incident',
  extends: BaseSchema,
  properties: {
    title: p.string(),
    origin: p.enum(IncidentOrigin),
    priority: p.enum(IncidentPriority).nullable(),
    status: p.enum(IncidentStatus).default(IncidentStatus.PENDING),
    code: p.string(),
    address: p.string(),
    postal: p.string().nullable(),
    attachedUnits: () => p.oneToMany(UnitEntity).mappedBy('incident').default([]),
    description: p.string().nullable(),
    notes: () => p.oneToMany(IncidentNoteEntity).mappedBy('incident').default([]),
  },
});

export class IncidentEntity extends IncidentSchema.class {}
IncidentSchema.setClass(IncidentEntity);
