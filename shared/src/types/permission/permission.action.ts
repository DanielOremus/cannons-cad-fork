export const PermissionAction = [
  'create',
  'read',
  'update',
  'delete',
  'search',
  'assign-role',
  'assign-status',
  'manage-admins',
] as const;
export type PermissionAction = (typeof PermissionAction)[number];
