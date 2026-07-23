import { BaseEntity, defineEntity, p } from '@mikro-orm/core';
import { UserEntity } from '../../user/entities/user.entity';

export const EmailConfirmationSchema = defineEntity({
  name: 'EmailConfirmation',
  extends: BaseEntity,
  properties: {
    email: () => p.oneToOne(UserEntity).targetKey('email'),
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
