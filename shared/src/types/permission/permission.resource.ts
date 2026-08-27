export const PermissionResource = ['user', 'vehicle', 'character', 'citation'] as const;
export type PermissionResource = (typeof PermissionResource)[number];
