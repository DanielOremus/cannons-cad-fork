import { Body, Controller, Get, HttpCode, Param, Patch, Query, Req } from '@nestjs/common';
import { type Request } from 'express';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetOwnProfileQuery } from './queries/get-own-profile/get-own-profile.query.js';
import { GetUserQuery } from './queries/get-user/get-user.query.js';
import { UuidParamPipe } from '../../common/pipes/id-validation.pipe.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserCommand } from './commands/update-user/update-user.command.js';
import { UsersFilterDto } from './dto/get-users-filter.dto.js';
import { GetUsersListQuery } from './queries/get-users-list/get-users-list.query.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { type PermissionMeta } from '@project/shared';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';

@Controller('/users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Get('/')
  @RequirePermission('user', 'read')
  async getList(
    @Query(new ZodValidationPipe(UsersFilterDto.schema)) query: UsersFilterDto,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.queryBus.execute(new GetUsersListQuery(query, permissionMeta));
  }
  @Get('/me')
  @RequirePermission('user', 'read')
  async getMe(@Req() req: Request) {
    const id = req.user!.id;
    return await this.queryBus.execute(new GetOwnProfileQuery(id));
  }
  @Get('/:id')
  @RequirePermission('user', 'read')
  async getById(
    @Param('id', new UuidParamPipe()) id: string,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.queryBus.execute(new GetUserQuery(id, permissionMeta));
  }
  @Patch('/:id')
  @RequirePermission('user', 'update')
  @HttpCode(204)
  async update(
    @Param('id', new UuidParamPipe()) id: string,
    @Body(new ZodValidationPipe(UpdateUserDto.schema)) dto: UpdateUserDto,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.commandBus.execute(
      new UpdateUserCommand(id, dto, user.roles, permissionMeta),
    );
  }
}
