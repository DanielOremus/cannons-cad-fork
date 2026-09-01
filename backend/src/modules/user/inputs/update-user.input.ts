import { UserEntity } from '../entities/user.entity.js';

export type UpdateUserInput = Partial<
  Pick<UserEntity, 'name' | 'email' | 'roles' | 'status' | 'passwordHash' | 'emailConfirmed'>
>;
