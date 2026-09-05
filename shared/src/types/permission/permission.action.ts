export const PermissionAction = ['create', 'read', 'update', 'delete', 'search', 'start'] as const;
export type PermissionAction = (typeof PermissionAction)[number];
