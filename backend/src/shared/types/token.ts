import { UserRole, UserStatus } from '@project/shared';
import { TokenCategory } from '../constants/token-category.js';

export type TokenPayloads = {
  [TokenCategory.access]: {
    userStatus: UserStatus;
    emailConfirmed: boolean;
    userId: string;
    userRoles: UserRole[];
    familyId: string;
  };
  [TokenCategory.refresh]: {
    jti: string;
    familyId: string;
    userId: string;
  };
};

export type RedisRTokenData = TokenPayloads['refresh'] & { used: boolean };
