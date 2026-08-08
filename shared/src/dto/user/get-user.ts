import type { UserRole } from '../../types/user/user.role.js';
import type { UserStatus } from '../../types/user/user.status.js';

export class PublicUserResponseDto {
  name: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: string;
}

export class PrivateUserResponseDto extends PublicUserResponseDto {
  email: string;
  emailConfirmed: boolean;
}
