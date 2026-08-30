import { RolePermissions, UserRole } from '../types/user/user.role.js';
import { type Permission, type ResourceAction } from '../types/permission/index.js';
import { PermissionResource } from '../types/permission/permission.resource.js';
import { UserStatus } from '../types/user/user.status.js';
import type { PermissionScope } from '../types/permission/permission.scope.js';
import { StaffRolePriority } from '../types/user/staff-role.priority.js';

export function hasPermissionFromRoles<T extends PermissionResource>(
  roles: UserRole[],
  resource: T,
  action: ResourceAction<T>,
  scope: PermissionScope,
): boolean {
  const required = `${resource}:${action}:${scope}` as Permission;
  const userPerms = getPermissionsFromRoles(...roles);
  return userPerms.has(required);
}

export function hasPermission<T extends PermissionResource>(
  permissions: Permission[],
  resource: T,
  action: ResourceAction<T>,
  scope: PermissionScope,
) {
  const required = `${resource}:${action}:${scope}` as Permission;
  return permissions.includes(required);
}

export function hasPermissionFromSet<T extends PermissionResource>(
  permissions: Set<Permission>,
  resource: T,
  action: ResourceAction<T>,
  scope: PermissionScope,
) {
  const required = `${resource}:${action}:${scope}` as Permission;
  return permissions.has(required);
}

export function getPermissionsFromRoles(...roles: UserRole[]): Set<Permission> {
  return new Set<Permission>(roles.flatMap((role) => RolePermissions[role]));
}

type AccountActiveArgs = {
  status: UserStatus;
  emailConfirmed: boolean;
};

export function getStaffPriority(role: UserRole) {
  return StaffRolePriority[role] ?? 0;
}

export function hasHigherOrSamePriority(roles: UserRole[], comparePriority: number) {
  return roles.some((r) => getStaffPriority(r) >= comparePriority);
}

export function accountActive({ status, emailConfirmed }: AccountActiveArgs) {
  return status === UserStatus.APPROVED && emailConfirmed;
}
