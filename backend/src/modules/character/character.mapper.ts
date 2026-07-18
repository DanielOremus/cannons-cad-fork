import { Injectable } from '@nestjs/common';
import { Character } from '../../generated/prisma/client';
import { CharacterEntity } from './entities/character.entity';

@Injectable()
export class CharacterMapper {
  toDomain(prismaCharacter: Character): CharacterEntity {
    return { ...prismaCharacter };
  }
}
