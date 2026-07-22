import { CookieOptions } from 'express';

export const COOKEY_KEY = 'token';

export function prepareTokenCookie(token: string, ttl: number) {
  return {
    key: COOKEY_KEY,
    value: token,
    options: {
      httpOnly: true,
      maxAge: ttl,
      signed: true,
    } satisfies CookieOptions,
  };
}
