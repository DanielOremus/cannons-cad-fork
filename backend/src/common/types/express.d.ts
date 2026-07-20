import { AuthUser } from '../../shared/types/user';
import { PermissionScope } from '@project/shared';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      permissionScope?: PermissionScope;
    }
  }
}

export {};
