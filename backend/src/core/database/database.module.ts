import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../../mikro-orm.config.js';
import { DatabaseService } from './database.service.js';
import { UnitOfWork } from './unit-of-work.js';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      autoLoadEntities: true,
      entities: [],
      entitiesTs: [],
    }),
  ],
  providers: [DatabaseService, UnitOfWork],
  exports: [DatabaseService, UnitOfWork],
})
export class DatabaseModule {}
