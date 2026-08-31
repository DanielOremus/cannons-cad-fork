import type { UserRole } from '../../types/user/user.role.js';
import type { UserStatus } from '../../types/user/user.status.js';

export type PublicUserResponseDto = {
  id: string;
  name: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: string;
};

export type PrivateUserResponseDto = PublicUserResponseDto & {
  email: string;
  emailConfirmed: boolean;
};
