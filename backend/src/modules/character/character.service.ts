import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CharacterEntity } from './entities/character.entity';
import { NotFoundError } from '../../shared/errors/app.error';

@Injectable()
export class CharacterService {
  constructor(private readonly characterRepository: CharacterRepository) {}
  async search(dto: SearchCharacterDto): Promise<CharacterEntity> {
    const character = await this.characterRepository.findByNameAndDob(dto);
    if (!character) throw new NotFoundError('Character');
    return character;
  }
}
