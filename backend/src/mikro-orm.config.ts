import { defineConfig } from '@mikro-orm/postgresql';
import { buildConfig } from './core/config/config';
import { validate } from './core/config/config.validation';

import 'dotenv/config';

const config = validate(buildConfig());
export default defineConfig({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  dbName: config.database.name,
  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
});
