import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { CharacterService } from './character.service';
import type { Request } from 'express';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CharacterMapper } from './character.mapper';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('/characters')
@UseGuards(AuthGuard)
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly characterMapper: CharacterMapper,
  ) {}

  @Get('/search')
  @UsePipes(new ZodValidationPipe(SearchCharacterDto.schema))
  @RequirePermission('character', 'search')
  async search(@Body() dto: SearchCharacterDto) {
    const character = await this.characterService.search(dto);
    return this.characterMapper.toSearchResponseDto(character);
  }
  @Post('/create')
  @UsePipes(new ZodValidationPipe(CreateCharacterDto.schema))
  @RequirePermission('character', 'create')
  @HttpCode(201)
  async create(@Body() dto: CreateCharacterDto, @Req() req: Request) {
    const character = await this.characterService.create(req.user!.id, dto);
    return this.characterMapper.toItemResponseDto(character);
  }
}
