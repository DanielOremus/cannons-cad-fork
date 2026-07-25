import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterResponseDto } from './dto/search-character-response.dto';

@Injectable()
export class CharacterMapper {
  toSearchResponseDto(character: CharacterEntity): SearchCharacterResponseDto {
    return {
      ...character,
      age: character.age,
    };
  }
}
