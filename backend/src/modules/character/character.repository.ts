import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity.js';
import { SearchCharacterDto } from './dto/search-character.dto.js';
import { CreateCharacterInput } from './inputs/create-character.input.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';

@Injectable()
export abstract class CharacterRepository {
  abstract findByNameAndDob(
    data: SearchCharacterDto,
    populate?: CharacterPopulate[],
  ): Promise<CharacterEntity | null>;
  abstract create(data: CreateCharacterInput): Promise<CharacterEntity>;
  abstract delete(entity: CharacterEntity): Promise<void>;
  abstract update(entity: CharacterEntity, input: UpdateCharacterDto): Promise<CharacterEntity>;
  abstract findById(id: number, populate?: CharacterPopulate[]): Promise<CharacterEntity | null>;
  abstract countVehicles(entity: CharacterEntity): Promise<number>;
  abstract countCitations(entity: CharacterEntity): Promise<number>;
}

export type CharacterPopulate = 'user' | 'citations' | 'vehicles' | 'driverLicense';
