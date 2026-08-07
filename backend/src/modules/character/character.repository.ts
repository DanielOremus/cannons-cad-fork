import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CreateCharacterInput } from './inputs/create-character.input';

@Injectable()
export abstract class CharacterRepository {
  abstract findByNameAndDob(
    data: SearchCharacterDto,
    populate: CharacterPopulate[],
  ): Promise<CharacterEntity | null>;
  abstract create(data: CreateCharacterInput): Promise<CharacterEntity>;
  abstract delete(entity: CharacterEntity): Promise<void>;
}

export type CharacterPopulate = 'user' | 'citations' | 'vehicles';
