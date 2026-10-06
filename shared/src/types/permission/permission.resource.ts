export const DefinedPermissionResource = [
  'user',
  'vehicle',
  'character',
  'citation',
  'duty',
  'unit',
  'incident',
] as const;
export type DefinedPermissionResource = (typeof DefinedPermissionResource)[number];
