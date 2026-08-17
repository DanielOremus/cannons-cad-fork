import { Injectable } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CreateCharacterInput } from './inputs/create-character.input';
import { PaginationDto } from '@project/shared';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export abstract class CharacterRepository {
  abstract findByNameAndDob(
    data: SearchCharacterDto,
    populate?: CharacterPopulate[],
  ): Promise<CharacterEntity | null>;
  abstract create(data: CreateCharacterInput): Promise<CharacterEntity>;
  abstract delete(entity: CharacterEntity): Promise<void>;
  abstract update(entity: CharacterEntity, input: UpdateCharacterDto): Promise<void>;
  abstract findById(id: number, populate?: CharacterPopulate[]): Promise<CharacterEntity | null>;
}

export type CharacterPopulate = 'user' | 'citations' | 'vehicles' | 'driverLicense';
