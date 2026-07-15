import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT,
  env: process.env.ENV,
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
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
}));
