import { TokenCategory } from '../constants/token-category.js';

export type TokenPayloads = {
  [TokenCategory.access]: {
    emailConfirmed: boolean;
    userId: string;
    familyId: string;
  };
  [TokenCategory.refresh]: {
    jti: string;
    familyId: string;
    userId: string;
  };
};

export type RedisRTokenData = TokenPayloads['refresh'] & { used: boolean };
