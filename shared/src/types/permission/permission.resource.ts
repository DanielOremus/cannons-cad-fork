export const DefinedPermissionResource = [
  'user',
  'vehicle',
  'character',
  'citation',
  'duty',
  'unit',
] as const;
export type DefinedPermissionResource = (typeof DefinedPermissionResource)[number];
