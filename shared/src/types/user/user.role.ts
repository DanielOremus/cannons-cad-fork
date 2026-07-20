import { type Permission } from '../permission/index.js';

export const UserRole = [
  'POLICE',
  'CIVILIAN',
  'DISPATCH',
  'ADMIN',
  'REGISTERED',
] as const;

export type UserRole = (typeof UserRole)[number];

export const RolePermissions = {
  ADMIN: [],
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
