export const PermissionResource = ['user', 'vehicle', 'character', 'citation', 'duty'] as const;
export type PermissionResource = (typeof PermissionResource)[number];
