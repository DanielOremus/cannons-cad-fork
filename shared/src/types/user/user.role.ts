import { type Permission } from '../permission/index.js';

export const UserRole = {
  POLICE: 'POLICE',
  CIVILIAN: 'CIVILIAN',
  DISPATCH: 'DISPATCH',
  ADMIN: 'ADMIN',
  REGISTERED: 'REGISTERED',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RolePermissions = {
  ADMIN: [
    'user:read:any',
    'character:read:any',
    'character:delete:any',
    'vehicle:read:any',
    'vehicle:delete:any',
    'citation:delete:any',
  ],
  CIVILIAN: [
    'character:create:own',
    'character:read:own',
    'character:update:own',
    'character:delete:own',
    'vehicle:create:own',
    'vehicle:read:own',
    'vehicle:update:own',
    'vehicle:delete:own',
  ],
  DISPATCH: [],
  POLICE: [
    'character:search:any',
    'vehicle:search:any',
    'citation:create:any',
    'citation:read:any',
    'citation:delete:own',
    'citation:update:own',
  ],
  REGISTERED: ['user:read:own', 'user:update:own', 'user:delete:own'],
} as const satisfies Record<UserRole, Permission[]>;
