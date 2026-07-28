import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../../mikro-orm.config';
import { DatabaseService } from './database.service';
import { UnitOfWork } from './unit-of-work';

@Module({
  imports: [MikroOrmModule.forRoot({ ...mikroOrmConfig, autoLoadEntities: true, entities: [], entitiesTs: [] })],
  providers: [DatabaseService, UnitOfWork],
  exports: [DatabaseService, UnitOfWork],
})
export class DatabaseModule {}
