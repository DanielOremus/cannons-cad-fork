import { UserRole } from '@project/shared';

export const TokenType = {
  access: 'access',
  refresh: 'refresh',
} as const;
export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export type TokenPayloads = {
  [TokenType.access]: {
    userId: string;
    userRole: UserRole;
    familyId: string;
  };
  [TokenType.refresh]: {
    jti: string;
    familyId: string;
    userId: string;
  };
};

export type RedisRTokenData = TokenPayloads['refresh'] & { used: boolean };
