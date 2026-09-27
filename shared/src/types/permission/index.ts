import { CharacterPermissions } from './character.permissions.js';
import { CitationPermissions } from './citation.permissions.js';
import { DutyPermissions } from './duty.permissions.js';
import { UserPermissions } from './user.permissions.js';
import { VehiclePermissions } from './vehicle.permissions.js';
import { DefinedPermissionResource } from './permission.resource.js';
import type { PermissionMeta } from './permission.meta.js';
import { UnitPermissions } from './unit.permissions.js';

export const PermissionsMap = {
  user: UserPermissions,
  character: CharacterPermissions,
  vehicle: VehiclePermissions,
  citation: CitationPermissions,
  duty: DutyPermissions,
  unit: UnitPermissions,
} as const satisfies Record<DefinedPermissionResource, Record<string, PermissionMeta>>;

export type PermissionResource = keyof typeof PermissionsMap;

export type PermissionAction<R extends PermissionResource = PermissionResource> =
  keyof (typeof PermissionsMap)[R] & string;

export type Permission = {
  [R in keyof typeof PermissionsMap]: {
    [A in keyof (typeof PermissionsMap)[R]]: (typeof PermissionsMap)[R][A] extends {
      contexts: readonly (infer C)[];
    }
      ? `${R & string}:${A & string}:${C & string}`
      : (typeof PermissionsMap)[R][A] extends { scopes: readonly (infer S)[] }
        ? `${R & string}:${A & string}:${S & string}`
        : `${R & string}:${A & string}`;
  }[keyof (typeof PermissionsMap)[R]];
}[keyof typeof PermissionsMap];

export type PermissionBase = {
  [R in PermissionResource]: {
    [A in PermissionAction<R>]: {
      resource: R;
      action: A;
    };
  }[PermissionAction<R>];
}[PermissionResource];
