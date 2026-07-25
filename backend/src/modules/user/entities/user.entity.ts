import { UserRole, UserStatus } from '@project/shared';
import { p, defineEntity } from '@mikro-orm/core';
import { BaseSensitiveSchema } from '../../../shared/entities/base.entity';
import { CharacterEntity } from '../../character/entities/character.entity';

const UserSchema = defineEntity({
  name: 'User',
  extends: BaseSensitiveSchema,
  properties: {
    name: p.string(),
    email: p.string().unique(),
    roles: p
      .enum(() => UserRole)
      .array()
      .default([UserRole.REGISTERED]),
    status: p.enum(() => UserStatus).default(UserStatus.PENDING),
    emailConfirmed: p.boolean().default(false),
    passwordHash: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
    characters: () => p.oneToMany(CharacterEntity),
  },
});

export class UserEntity extends UserSchema.class {}
UserSchema.setClass(UserEntity);
