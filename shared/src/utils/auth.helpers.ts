import {
  PermissionAction,
  PermissionResource,
  RolePermissions,
  type Permission,
  type UserRole,
} from "../types/user.js"

export function hasPermission(
  role: UserRole,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  const required = `${resource}:${action}` as Permission
  return (RolePermissions[role] as readonly Permission[]).includes(required)
}
