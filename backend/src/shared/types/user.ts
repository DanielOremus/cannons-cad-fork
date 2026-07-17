import { UserEntity } from '../../modules/user/entities/user.entity';

export type CreateUserInput = Pick<
  UserEntity,
  'email' | 'name' | 'passwordHash'
>;

export type UserProfileResponseType = 'public' | 'private';
