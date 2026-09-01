import { defineConfig } from '@mikro-orm/postgresql';
import getConfig from './core/config/config';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

const config = getConfig();

export default defineConfig({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  dbName: config.database.name,
  pool: {
    min: 2,
    max: 10,
  },
  debug: config.env === 'development',
  entities: ['./dist/modules/**/*.entity.js', './dist/shared/entities/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts', './src/shared/entities/*.entity.ts'],
  extensions: [Migrator, SeedManager],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    transactional: true,
    safe: false,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    emit: 'ts',
  },
});
