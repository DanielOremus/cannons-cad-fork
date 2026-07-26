import { defineEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export const BaseSchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: {
    id: p.integer().primary(),
  },
});

export const BaseSensitiveSchema = defineEntity({
  name: 'BaseSensitiveEntity',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
  },
});
