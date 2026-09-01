import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SearchCharacterDto } from './dto/search-character.dto.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { type PaginationDto } from '@project/shared';
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

@Controller('/characters')
export class CharacterController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/search')
  @RequirePermission('character', 'search')
  async search(@Query(new ZodValidationPipe(SearchCharacterDto.schema)) dto: SearchCharacterDto) {
    return this.queryBus.execute(new SearchCharacterQuery(dto));
  }
  @Get('/:id')
  @RequirePermission('character', 'read')
  async getById(@Param('id', new IdParamPipe()) id: number) {
    return await this.queryBus.execute(new GetCharacterQuery(id));
  }
  @Post('/create')
  @RequirePermission('character', 'create')
  @HttpCode(201)
  async create(
    @Body(new ZodValidationPipe(CreateCharacterDto.schema)) dto: CreateCharacterDto,
    @Req() req: Request,
  ) {
    return await this.commandBus.execute(new CreateCharacterCommand(dto, req.user!.id));
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
    @Req() req: Request,
    @Body(new ZodValidationPipe(UpdateCharacterDto.schema)) dto: UpdateCharacterDto,
    @Param('id', new IdParamPipe()) characterId: number,
  ) {
    await this.commandBus.execute(
      new UpdateCharacterCommand(characterId, req.user!.id, dto, req.permissionScope!),
    );
  }
  @Delete('/:id')
  @RequirePermission('character', 'delete')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('id', new IdParamPipe()) characterId: number) {
    await this.commandBus.execute(
      new DeleteCharacterCommand(characterId, req.user!.id, req.permissionScope!),
    );
  }
}
