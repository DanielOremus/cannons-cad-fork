import { type Permission } from '../permission/index.js';

// export const UserRole = {
//   POLICE: 'police',
//   CIVILIAN: 'civilian',
//   DISPATCH: 'dispatch',
//   ADMIN: 'admin',
//   REGISTERED: 'registered',
// };

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
    'character:create',
    'character:read',
    'character:update',
    'character:delete',
  ],
  DISPATCH: [],
  POLICE: [],
  REGISTERED: [],
} as const satisfies Record<UserRole, Permission[]>;
