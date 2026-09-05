import { PermissionMeta } from '@project/shared/src/types/permission/permission.meta.ts';
import { AuthUser } from '../../shared/types/user.ts';
import { PermissionScope } from '@project/shared';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      permissionMeta?: PermissionMeta;
    }
    interface Locals {
      refreshToken?: string;
    }
  }
}

export {};
