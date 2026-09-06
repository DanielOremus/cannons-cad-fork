import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { SearchCharacterDto } from './dto/search-character.dto.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { type PermissionMeta, type PaginationDto } from '@project/shared';
import { paginationSchema } from '@project/shared';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCharacterQuery } from './queries/get-character/get-character.query.js';
import { SearchCharacterQuery } from './queries/search-character/search-character.query.js';
import { CreateCharacterCommand } from './commands/create-character/create-character.command.js';
import { GetCharacterCitationsQuery } from '../citation/queries/get-character-citations/get-character-citations.query.js';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';
import { UpdateCharacterCommand } from './commands/update-character/update-character.command.js';
import { DeleteCharacterCommand } from './commands/delete-character/delete-character.command.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';

@Controller('/characters')
export class CharacterController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/search')
  @RequirePermission('character', 'read')
  async search(
    @Query(new ZodValidationPipe(SearchCharacterDto.schema)) dto: SearchCharacterDto,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return this.queryBus.execute(new SearchCharacterQuery(dto, permissionMeta));
  }
  @Get('/:id')
  @RequirePermission('character', 'read')
  async getById(
    @Param('id', new IdParamPipe()) id: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    return await this.queryBus.execute(new GetCharacterQuery(id, user.id, permissionMeta));
  }
  @Post('/create')
  @RequirePermission('character', 'create')
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(CreateCharacterDto.schema)) dto: CreateCharacterDto,
    @GetAuthUser() user: AuthUser,
  ) {
    return await this.commandBus.execute(new CreateCharacterCommand(dto, user.id));
  }
  @Get('/:id/citations')
  @RequirePermission('character', 'read')
  async getCitations(
    @Param('id', new IdParamPipe()) id: number,
    @Query(new ZodValidationPipe(paginationSchema)) query: PaginationDto,
  ) {
    return this.queryBus.execute(
      new GetCharacterCitationsQuery(id, { limit: query.limit, page: query.page }),
    );
  }
  @Patch('/:id')
  @RequirePermission('character', 'update')
  @HttpCode(204)
  async update(
    @Body(new ZodValidationPipe(UpdateCharacterDto.schema)) dto: UpdateCharacterDto,
    @Param('id', new IdParamPipe()) characterId: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.commandBus.execute(
      new UpdateCharacterCommand(characterId, user.id, dto, permissionMeta),
    );
  }
  @Delete('/:id')
  @RequirePermission('character', 'delete')
  @HttpCode(204)
  async delete(
    @Param('id', new IdParamPipe()) characterId: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.commandBus.execute(new DeleteCharacterCommand(characterId, user.id, permissionMeta));
  }
}
