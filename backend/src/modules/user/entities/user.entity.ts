import { UserRole, UserStatus } from '@project/shared';
import { p, defineEntity, EventArgs } from '@mikro-orm/core';
import { BaseSensitiveSchema } from '../../../shared/entities/base.entity.js';
import { CharacterEntity } from '../../character/entities/character.entity.js';

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
    characters: () => p.oneToMany(CharacterEntity).mappedBy('user'),
  },
});

export class UserEntity extends UserSchema.class {}
UserSchema.setClass(UserEntity);

//block REGISTERED role from removal
UserSchema.addHook('beforeUpdate', (args: EventArgs<UserEntity>) => {
  const user = args.entity;
  if (Array.isArray(user.roles) && !user.roles.includes(UserRole.REGISTERED))
    user.roles.push(UserRole.REGISTERED);
});
