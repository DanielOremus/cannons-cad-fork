import type { PermissionMeta } from './permission.meta.js';
import { PermissionType } from './permission.type.js';

export const VehiclePermissions = {
  create: {
    type: PermissionType.GLOBAL,
  },
  read: {
    type: PermissionType.SCOPED,
    scopes: ['any', 'own'],
  },
  update: {
    type: PermissionType.SCOPED,
    scopes: ['own'],
  },
  delete: {
    type: PermissionType.SCOPED,
    scopes: ['any', 'own'],
  },
} as const satisfies Record<string, PermissionMeta>;
