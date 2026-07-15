import type { UserRole, UserStatus } from '@project/shared';
import { BaseEntityUuid } from '../../../shared/entities/base.entity';

export class UserEntity implements BaseEntityUuid {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailConfirmed: boolean;
  passwordHash: string;
  createdAt: Date;
}
