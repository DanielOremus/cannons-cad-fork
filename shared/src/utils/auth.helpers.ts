import { RolePermissions, UserRole } from '../types/user/user.role.js';
import { type Permission } from '../types/permission/index.js';
import { PermissionResource } from '../types/permission/permission.resource.js';
import { PermissionAction } from '../types/permission/permission.action.js';

export function hasPermission(
  role: UserRole,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  const required = `${resource}:${action}` as Permission;
  return (RolePermissions[role] as readonly Permission[]).includes(required);
}
