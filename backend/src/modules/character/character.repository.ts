import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterDto } from './dto/search-character.dto';

@Injectable()
export abstract class CharacterRepository {
  abstract findByNameAndDob(
    data: SearchCharacterDto,
  ): Promise<CharacterEntity | null>;
}
