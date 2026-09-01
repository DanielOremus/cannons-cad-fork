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

@Controller('/users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Get('/')
  @RequirePermission('user', 'read')
  async getList(
    @Req() req: Request,
    @Query(new ZodValidationPipe(UsersFilterDto.schema)) query: UsersFilterDto,
  ) {
    return await this.queryBus.execute(new GetUsersListQuery(query, req.permissionScope!));
  }
  @Get('/me')
  @RequirePermission('user', 'read')
  async getMe(@Req() req: Request) {
    const id = req.user!.id;
    return await this.queryBus.execute(new GetOwnProfileQuery(id));
  }
  @Get('/:id')
  @RequirePermission('user', 'read')
  async getById(@Param('id', new UuidParamPipe()) id: string, @Req() req: Request) {
    return await this.queryBus.execute(new GetUserQuery(id, req.permissionScope!));
  }
  @Patch('/:id')
  @RequirePermission('user', 'update')
  @HttpCode(204)
  async update(
    @Param('id', new UuidParamPipe()) id: string,
    @Req() req: Request,
    @Body(new ZodValidationPipe(UpdateUserDto.schema)) dto: UpdateUserDto,
  ) {
    return await this.commandBus.execute(
      new UpdateUserCommand(id, dto, req.user!.roles, req.permissionScope!),
    );
  }
}
