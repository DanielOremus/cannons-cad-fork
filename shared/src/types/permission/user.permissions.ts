import type { PermissionMeta } from './permission.meta.js';
import { PermissionType } from './permission.type.js';

export const UserPermissions = {
  read: {
    type: PermissionType.SCOPED,
    scopes: ['own', 'any'],
  },
  delete: {
    type: PermissionType.SCOPED,
    scopes: ['own'],
  },
  update: {
    type: PermissionType.SCOPED,
    scopes: ['own', 'any'],
  },
} as const satisfies Record<string, PermissionMeta>;
