import { UserEntity } from '../entities/user.entity';

export type CreateUserInput = Pick<
  UserEntity,
  'email' | 'name' | 'passwordHash'
>;
