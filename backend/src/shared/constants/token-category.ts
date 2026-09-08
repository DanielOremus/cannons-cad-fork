export const TokenCategory = {
  access: 'access',
  refresh: 'refresh',
} as const;
export type TokenCategory = (typeof TokenCategory)[keyof typeof TokenCategory];
