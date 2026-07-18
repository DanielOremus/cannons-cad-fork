import { Body, Controller, Get } from '@nestjs/common';
import { CharacterService } from './character.service';
import { SearchCharacterDto } from './dto/search-character.dto';

@Controller('/character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}
  @Get('/search')
  async search(@Body() dto: SearchCharacterDto) {
    const character = await this.characterService.search(dto);
    return { found: !!character, data: character };
  }
}
