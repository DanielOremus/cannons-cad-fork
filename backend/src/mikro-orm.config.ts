import { defineConfig } from '@mikro-orm/postgresql';
import { buildConfig } from './core/config/config';
import { validate } from './core/config/config.validation';
import { Migrator } from '@mikro-orm/migrations';

import 'dotenv/config';

const config = validate(buildConfig());
export default defineConfig({
  // host: config.database.host,
  // port: config.database.port,
  // user: config.database.user,
  // password: config.database.password,
  // dbName: config.database.name,
  driverOptions: {
    ssl: { rejectUnauthorized: false },
  },
  debug: true,
  clientUrl: config.database.url,
  entities: ['dist/modules/**/*.entity.js', 'dist/shared/entities/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts', 'src/shared/entities/*.entity.ts'],
  extensions: [Migrator],
});
