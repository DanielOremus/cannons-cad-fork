import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT,
  env: process.env.ENV,
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTtl: process.env.ACCESS_TOKEN_EXPIRE,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTtl: process.env.REFRESH_TOKEN_EXPIRE,
  },
  redis: {},
  database: {
    url: process.env.DATABASE_URL,
  },
}));
