import { Permission } from '@project/shared';
import { UserEntity } from '../../modules/user/entities/user.entity';

export type CreateUserInput = Pick<
  UserEntity,
  'email' | 'name' | 'passwordHash'
>;

export type UserProfileResponseType = 'public' | 'private';

export type AuthUser = Pick<UserEntity, 'id'> & {
  permissions: Set<Permission>;
  familyId: string;
};
