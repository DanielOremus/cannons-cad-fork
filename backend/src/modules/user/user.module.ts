import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { DatabaseModule } from '../../core/database/database.module';
import { OrmUserRepository } from './infrastructure/orm-user.repository';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    UserMapper,
  ],
  exports: [UserRepository, UserMapper],
})
export class UserModule {}
