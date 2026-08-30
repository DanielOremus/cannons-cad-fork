import { ThrottlerOptions } from '@nestjs/throttler';

export const appThrottlers = {
  default: {
    limit: 300,
    ttl: 60000,
  },
  login: {
    limit: 5,
    ttl: 15 * 60000,
  },
  register: {
    limit: 5,
    ttl: 60 * 60000,
  },
  refresh: {
    limit: 10,
    ttl: 60000,
  },
  resendConfirmation: {
    limit: 3,
    ttl: 5 * 60000,
  },
} satisfies Record<string, ThrottlerOptions>;
