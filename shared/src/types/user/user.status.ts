export const UserStatus = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
