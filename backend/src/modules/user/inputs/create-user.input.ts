import { UserEntity } from '../entities/user.entity.js';

export type CreateUserInput = Pick<UserEntity, 'email' | 'name' | 'passwordHash'>;
