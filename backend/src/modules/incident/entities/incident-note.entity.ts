import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { IncidentEntity } from './incident.entity.js';

export const IncidentNoteSchema = defineEntity({
  name: 'IncidentNote',
  extends: BaseSchema,
  properties: {
    incident: () => p.manyToOne(IncidentEntity).deleteRule('cascade').inversedBy('notes'),
    text: p.string(),
    author: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export class IncidentNoteEntity extends IncidentNoteSchema.class {}
IncidentNoteSchema.setClass(IncidentNoteEntity);
