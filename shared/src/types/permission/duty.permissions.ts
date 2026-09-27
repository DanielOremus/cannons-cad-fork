import { DutyType } from '../duty.type.js';
import type { PermissionMeta } from './permission.meta.js';
import { PermissionType } from './permission.type.js';

export const DutyPermissions = {
  start: {
    type: PermissionType.CONTEXTUAL,
    contexts: Object.values(DutyType),
  },
  end: {
    type: PermissionType.GLOBAL,
  },
} as const satisfies Record<string, PermissionMeta>;
