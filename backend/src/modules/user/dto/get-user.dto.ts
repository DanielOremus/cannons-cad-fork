import {
  PublicUserResponseDto as PublicReadDto,
  PrivateUserResponseDto as PrivateReadDto,
  UserRole,
  UserStatus,
} from '@project/shared';

export class UserDto implements PublicReadDto {
  id: string;
  name: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: string;
}
export class ProfileDto extends UserDto implements PrivateReadDto {
  email: string;
  emailConfirmed: boolean;
}
