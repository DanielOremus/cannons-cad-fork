import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserRepository } from './user.repository.js';
import { UserMapper } from './user.mapper.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity.js';
import { DatabaseModule } from '../../core/database/database.module.js';
import { OrmUserRepository } from './infrastructure/orm.user.repository.js';
import { TokenModule } from '../../shared/modules/token/token.module.js';
import { GetUserHandler } from './queries/get-user/get-user.handler.js';
import { GetOwnProfileHandler } from './queries/get-own-profile/get-own-profile.handler.js';
import { AuthCacheModule } from '../../shared/modules/auth-cache/auth-cache.module.js';
import { UpdateUserHandler } from './commands/update-user/update-user.handler.js';
import { GetUsersListHandler } from './queries/get-users-list/get-users-list.handler.js';

const queryHandlers = [GetUserHandler, GetOwnProfileHandler, GetUsersListHandler];
const commandHandlers = [UpdateUserHandler];

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), DatabaseModule, TokenModule, AuthCacheModule],
  controllers: [UserController],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    UserMapper,
  ],
  exports: [UserRepository, UserMapper],
})
export class UserModule {}
