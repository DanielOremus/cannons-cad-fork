import { defineEntity, p } from '@mikro-orm/core';
import { UserEntity } from '../../user/entities/user.entity';
import { BaseSchema } from '../../../shared/entities/base.entity';

export const EmailConfirmationSchema = defineEntity({
  name: 'EmailConfirmation',
  extends: BaseSchema,
  properties: {
    email: p.string().unique(),
    user: () => p.oneToOne(UserEntity).mappedBy('email'),
    code: p.decimal('string').columnType('decimal(6,0)'),
    attempts: p.tinyint().default(0),
    createdAt: p.datetime().default(new Date()),
    expiresAt: p.datetime(),
  },
});

export class EmailConfirmationEntity extends EmailConfirmationSchema.class {
  incrementAttempt() {
    this.attempts++;
  }
}
EmailConfirmationSchema.setClass(EmailConfirmationEntity);
