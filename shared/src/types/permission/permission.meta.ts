import type { PermissionScope } from './permission.scope.js';
import type { PermissionType } from './permission.type.js';

export type ScopedPermissionMeta = {
  type: typeof PermissionType.SCOPED;
  scopes: PermissionScope[];
};
export type ContextualPermissionMeta = {
  type: typeof PermissionType.CONTEXTUAL;
  contexts: string[];
};

export type GlobalPermissionMeta = {
  type: typeof PermissionType.GLOBAL;
};

export type PermissionMeta = ContextualPermissionMeta | ScopedPermissionMeta | GlobalPermissionMeta;
