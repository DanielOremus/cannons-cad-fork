import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { SearchCharacterDto } from './dto/search-character.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { CharacterMapper } from './character.mapper';

@Controller('/characters')
@UseGuards(AuthGuard)
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly characterMapper: CharacterMapper,
  ) {}

  @Get('/search')
  @RequirePermission('character', 'search')
  async search(@Body() dto: SearchCharacterDto) {
    const character = await this.characterService.search(dto);
    return this.characterMapper.toSearchResponseDto(character);
  }
}
