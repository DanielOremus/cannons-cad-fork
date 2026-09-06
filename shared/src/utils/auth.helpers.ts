import { RolePermissions, UserRole } from '../types/user/user.role.js';
import { PermissionsMap, type PermissionResource } from '../types/permission/index.js';
import { type Permission, type PermissionAction } from '../types/permission/index.js';
import { UserStatus } from '../types/user/user.status.js';
import { StaffRolePriority } from '../types/user/staff-role.priority.js';
import type { PermissionMeta } from '../types/permission/permission.meta.js';
import { PermissionType } from '../types/permission/permission.type.js';

export function hasPermissionFromRoles(roles: UserRole[], required: Permission) {
  const userPerms = getPermissionsFromRoles(...roles);
  return userPerms.has(required);
}

export function hasPermission(permissions: Permission[], required: Permission) {
  return permissions.includes(required);
}

export function hasPermissionFromSet(permissions: Set<Permission>, permission: Permission) {
  return permissions.has(permission);
}

export function findPermissionsByPrefix<T>(
  permissions: Set<Permission>,
  prefix: string,
  allowedArgs?: readonly T[],
) {
  const resultArr: Permission[] = [];
  const resultArgs: T[] = [];
  for (const perm of permissions) {
    if (perm.startsWith(prefix)) {
      const permArg = perm.slice(prefix.length) as T;
      if (!allowedArgs || allowedArgs.includes(permArg)) {
        resultArr.push(perm);
        resultArgs.push(permArg);
      }
    }
  }
  return { permissions: resultArr, permissionArgs: resultArgs };
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

export function getHighestRolePriority(roles: UserRole[]) {
  return Math.max(...roles.map(getStaffPriority));
}

export function hasHigherOrSamePriority(roles: UserRole[], comparePriority: number) {
  return roles.some((r) => getStaffPriority(r) >= comparePriority);
}

export function buildPermission<R extends PermissionResource>(
  resource: R,
  action: PermissionAction<R>,
  arg?: string,
) {
  // eslint-disable-next-line
  const permMeta = (PermissionsMap[resource] as any)[action] as PermissionMeta;
  if (permMeta.type === PermissionType.GLOBAL) return `${resource}:${action}` as Permission;
  return `${resource}:${action}:${arg}` as Permission;
}

export function accountActive({ status, emailConfirmed }: AccountActiveArgs) {
  return status === UserStatus.APPROVED && emailConfirmed;
}
