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
import { PermissionsModule } from '../../shared/modules/permissions/permissions.module';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { GetUsersListHandler } from './queries/get-users-list/get-users-list.handler';

const queryHandlers = [GetUserHandler, GetOwnProfileHandler, GetUsersListHandler];
const commandHandlers = [UpdateUserHandler];

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    DatabaseModule,
    TokenModule,
    PermissionsModule,
  ],
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
