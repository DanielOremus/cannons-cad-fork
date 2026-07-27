import { registerAs } from '@nestjs/config';
import { validate } from './config.validation';

export const buildConfig = () => {
  return {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
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
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
      url: process.env.DATABASE_URL,
    },
    mailer: {
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      user: process.env.MAILER_USER,
      secure: process.env.MAILER_SECURE,
      password: process.env.MAILER_PASSWORD,
    },
    email: {
      username: process.env.EMAIL_USERNAME,
      confirmationTtl: process.env.EMAIL_CONFIRMATION_TTL,
    },
  };
};

export const registerConfig = registerAs('app', () => {
  const config = buildConfig();
  return validate(config);
});
