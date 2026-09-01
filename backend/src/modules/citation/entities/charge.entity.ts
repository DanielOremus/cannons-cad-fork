import { p, defineEntity } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { CitationEntity } from './citation.entity.js';

export const ChargeSchema = defineEntity({
  name: 'Charge',
  extends: BaseSchema,
  properties: {
    amount: p.integer(),
    reason: p.string(),
    jailTime: p.string().nullable(),
    count: p.integer().default(1),
    citation: () => p.manyToOne(CitationEntity).deleteRule('cascade'),
  },
});

export class ChargeEntity extends ChargeSchema.class {}
ChargeSchema.setClass(ChargeEntity);
