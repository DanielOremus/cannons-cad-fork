import type { PermissionMeta } from './permission.meta.js';
import { PermissionType } from './permission.type.js';

export const CitationPermissions = {
  read: {
    type: PermissionType.SCOPED,
    scopes: ['any', 'own'],
  },
  create: {
    type: PermissionType.GLOBAL,
  },
  delete: {
    type: PermissionType.SCOPED,
    scopes: ['any', 'own'],
  },
  update: {
    type: PermissionType.SCOPED,
    scopes: ['any', 'own'],
  },
} as const satisfies Record<string, PermissionMeta>;
