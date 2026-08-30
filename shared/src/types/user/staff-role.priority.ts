import { UserRole } from './user.role.js';

export const StaffRolePriority: Partial<Record<UserRole, number>> = {
  [UserRole.SUPER_ADMIN]: 2,
  [UserRole.ADMIN]: 1,
};
