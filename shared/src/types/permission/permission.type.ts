export const PermissionType = {
  CONTEXTUAL: 'contextual',
  GLOBAL: 'global',
  SCOPED: 'scoped',
} as const;

export type PermissionType = (typeof PermissionType)[keyof typeof PermissionType];
