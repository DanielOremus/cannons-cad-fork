import { Permission, UserRole } from '@project/shared';
import { UserEntity } from '../../modules/user/entities/user.entity.js';
import { ProfileDto } from '../../modules/user/dto/get-user.dto.js';

export type UserProfileResponseType = 'public' | 'private';

export type AuthUser = Pick<UserEntity, 'id'> & {
  roles: UserRole[];
  permissions: Set<Permission>;
  familyId: string;
};

export type UserAuthResponse = {
  refresh: string;
  access: string;
  user: ProfileDto;
};
