import { Permission } from '@project/shared';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { ProfileDto } from '../../modules/user/dto/get-user.dto';

export type UserProfileResponseType = 'public' | 'private';

export type AuthUser = Pick<UserEntity, 'id'> & {
  permissions: Set<Permission>;
  familyId: string;
};

export type UserAuthResponse = {
  refresh: string;
  access: string;
  user: ProfileDto;
};
