import { registerAs } from '@nestjs/config';
import { validate } from './config.validation';

export const registerConfig = registerAs('app', () => {
  const config = {
    port: process.env.PORT,
    env: process.env.ENV,
    cookieSecret: process.env.COOKIE_SECRET,
    jwt: {
      access: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        ttl: process.env.ACCESS_TOKEN_EXPIRE,
      },
      refresh: {
        secret: process.env.REFRESH_TOKEN_SECRET,
        ttl: process.env.REFRESH_TOKEN_EXPIRE,
      },
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      user: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
  };
  return validate(config);
});
