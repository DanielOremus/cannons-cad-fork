export const DefinedPermissionResource = [
  'user',
  'vehicle',
  'character',
  'citation',
  'duty',
] as const;
export type DefinedPermissionResource = (typeof DefinedPermissionResource)[number];
