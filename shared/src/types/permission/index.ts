import { PermissionResource } from './permission.resource.js';
import { PermissionAction } from './permission.action.js';
import { PermissionScope } from './permission.scope.js';

//Конфіг ресурсів з можливими діями та суфіксами
export const ResourceActions = {
  user: {
    read: ['any', 'own'],
    delete: ['own'],
    update: ['own', 'any'],
    'assign-role': ['any'],
    'assign-status': ['any'],
    'manage-admins': ['any'],
  },
  character: {
    create: ['own'],
    read: ['any', 'own'],
    delete: ['any', 'own'],
    search: ['any'],
    update: ['own'],
  },
  vehicle: {
    create: ['own'],
    read: ['any', 'own'],
    update: ['own'],
    delete: ['any', 'own'],
    search: ['any'],
  },
  citation: {
    read: ['own', 'any'],
    create: ['any'],
    delete: ['own', 'any'],
    update: ['own', 'any'],
  },
} as const satisfies Record<PermissionResource, { [P in PermissionAction]?: PermissionScope[] }>;

export type ResourceActions<T extends PermissionResource> = (typeof ResourceActions)[T];

export type ResourceAction<T extends PermissionResource> = keyof ResourceActions<T> & string;

// type SuffixForAction<
//   Action extends string,
//   Type,
// > = Type extends (typeof ActionType)[0]
//   ? { [S in PermissionScope]: `${Action}:${S}` }[PermissionScope]
//   : Action;

// type PermissionsForResource<R extends PermissionResource> = {
//   [A in ResourceAction<R>]: {
//     [S in typeof ResourceActions[R][A]]: ;
//   };
// }

type RawScope<
  R extends PermissionResource,
  A extends ResourceAction<R>,
> = (typeof ResourceActions)[R][A];

type GetScope<R extends PermissionResource, A extends ResourceAction<R>> = Extract<
  RawScope<R, A>,
  readonly string[]
>[number] &
  string;

type PermissionsForResource<R extends PermissionResource> = {
  [A in ResourceAction<R>]: `${A}:${GetScope<R, A>}`;
}[ResourceAction<R>];

export type Permission = {
  [R in PermissionResource]: `${R}:${PermissionsForResource<R>}`;
}[PermissionResource];

export type RequiredPermission = {
  [R in PermissionResource]: {
    resource: R;
    action: ResourceAction<R>;
  };
}[PermissionResource];
