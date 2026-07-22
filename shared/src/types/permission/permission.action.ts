export const PermissionAction = [
  'create',
  'read',
  'update',
  'delete',
  'search',
] as const;
export type PermissionAction = (typeof PermissionAction)[number];
