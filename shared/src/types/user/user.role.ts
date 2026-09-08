import { type Permission } from '../permission/index.js';

export const UserRole = {
  POLICE: 'POLICE',
  CIVILIAN: 'CIVILIAN',
  DISPATCH: 'DISPATCH',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  REGISTERED: 'REGISTERED',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RolePermissions = {
  SUPER_ADMIN: ['user:update:any'],
  ADMIN: [
    'user:read:any',
    'user:update:any',
    'character:read:any',
    'character:delete:any',
    'vehicle:read:any',
    'vehicle:delete:any',
    'citation:delete:any',
  ],
  CIVILIAN: [
    'character:create',
    'character:read:own',
    'character:update:own',
    'character:delete:own',
    'vehicle:create',
    'vehicle:read:own',
    'vehicle:update:own',
    'vehicle:delete:own',
  ],
  DISPATCH: ['unit:read:any', 'unit:update:any'],
  POLICE: [
    'character:read:any',
    'vehicle:read:any',
    'citation:create',
    'citation:read:any',
    'citation:delete:own',
    'citation:update:own',
    'unit:read:any',
    'unit:update:own',
  ],
  REGISTERED: ['user:read:own', 'user:update:own', 'user:delete:own'],
} as const satisfies Record<UserRole, Permission[]>;
