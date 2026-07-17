export const PermissionAction = ['create', 'read', 'update', 'delete'] as const;
export type PermissionAction = (typeof PermissionAction)[number];
