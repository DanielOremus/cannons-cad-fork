import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';

export const IncidentCodeSchema = defineEntity({
  name: 'IncidentCode',
  extends: BaseSchema,
  properties: {
    title: p.string(),
  },
});
