export const PermissionResource = ['user', 'vehicle', 'character'] as const;
export type PermissionResource = (typeof PermissionResource)[number];
