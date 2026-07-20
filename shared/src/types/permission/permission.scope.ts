export const PermissionScope = ['any', 'own'] as const;
export type PermissionScope = (typeof PermissionScope)[number];
