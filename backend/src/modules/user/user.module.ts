import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { DatabaseModule } from '../../core/database/database.module';
import { OrmUserRepository } from './infrastructure/orm.user.repository';
import { TokenModule } from '../../shared/modules/token/token.module';
import { GetUserHandler } from './queries/get-user/get-user.handler';
import { GetOwnProfileHandler } from './queries/get-own-profile/get-own-profile.handler';

const queryHandlers = [GetUserHandler, GetOwnProfileHandler];

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), DatabaseModule, TokenModule],
  controllers: [UserController],
  providers: [
    ...queryHandlers,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    UserMapper,
  ],
  exports: [UserRepository, UserMapper],
})
export class UserModule {}
