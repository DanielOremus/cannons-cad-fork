import { defineEntity, p } from '@mikro-orm/core';
import { UserEntity } from '../../user/entities/user.entity';
import { BaseSchema } from '../../../shared/entities/base.entity';

export const EmailConfirmationSchema = defineEntity({
  name: 'EmailConfirmation',
  extends: BaseSchema,
  properties: {
    email: p.string().unique(),
    code: p.decimal('string').precision(6).scale(0),
    attempts: p.tinyint().default(0),
    createdAt: p.datetime().onCreate(() => new Date()),
    expiresAt: p.datetime(),
  },
});

export class EmailConfirmationEntity extends EmailConfirmationSchema.class {
  incrementAttempt() {
    this.attempts++;
  }
}
EmailConfirmationSchema.setClass(EmailConfirmationEntity);
