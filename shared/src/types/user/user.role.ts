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
  ADMIN: ['user:read:any'],
  CIVILIAN: [
    'character:create:own',
    'character:read:own',
    'character:update:own',
    'character:delete:own',
  ],
  DISPATCH: [],
  POLICE: ['character:search:any'],
  REGISTERED: ['user:read:own', 'user:update:own', 'user:delete:own'],
} as const satisfies Record<UserRole, Permission[]>;
