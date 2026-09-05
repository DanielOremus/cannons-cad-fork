import { Body, Controller, Delete, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CreateCitationDto } from './dto/create-citation.dto.js';
import { IssueCitationCommand } from './commands/issue-citation/issue-citation.command.js';
import { type Request } from 'express';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe.js';
import { DeleteCitationCommand } from './commands/delete-citation/delete-citation.command.js';
import { UpdateCitationDto } from './dto/update-citation.dto.js';
import { UpdateCitationCommand } from './commands/update-citation/update-citation.command.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { type PermissionMeta } from '@project/shared';

@Controller('/citations')
export class CitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/issue')
  @RequirePermission('citation', 'create')
  @HttpCode(201)
  async issue(
    @Req() req: Request,
    @Body(new ZodValidationPipe(CreateCitationDto.schema)) dto: CreateCitationDto,
  ) {
    await this.commandBus.execute(new IssueCitationCommand(dto, req.user!.id));
  }
  @Patch('/:id')
  @RequirePermission('citation', 'update')
  async update(
    @Param('id', new IdParamPipe()) id: number,
    @Body(new ZodValidationPipe(UpdateCitationDto.schema)) dto: UpdateCitationDto,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.commandBus.execute(new UpdateCitationCommand(id, dto, user.id, permissionMeta));
  }

  @Delete('/:id')
  @RequirePermission('citation', 'delete')
  @HttpCode(204)
  async delete(
    @Param('id', new IdParamPipe()) id: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.commandBus.execute(new DeleteCitationCommand(id, user.id, permissionMeta));
  }
}
