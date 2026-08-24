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
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { type PaginationDto } from '@project/shared';
import { paginationSchema } from '@project/shared';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCharacterQuery } from './queries/get-character/get-character.query';
import { SearchCharacterQuery } from './queries/search-character/search-character.query';
import { CreateCharacterCommand } from './commands/create-character/create-character.command';
import { GetCharacterCitationsQuery } from '../citation/queries/get-character-citations/get-character-citations.query';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { UpdateCharacterCommand } from './commands/update-character/update-character.command';
import { DeleteCharacterCommand } from './commands/delete-character/delete-character.command';

@Controller('/characters')
@UseGuards(AuthGuard, PermissionsGuard)
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
