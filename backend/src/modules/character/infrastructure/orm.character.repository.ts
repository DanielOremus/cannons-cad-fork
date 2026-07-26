import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterRepository } from '../character.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { SearchCharacterDto } from '../dto/search-character.dto';

@Injectable()
export class OrmCharacterRepository extends CharacterRepository {
  private readonly entity = CharacterEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findByNameAndDob(data: SearchCharacterDto): Promise<CharacterEntity | null> {
    return await this.em.findOne(this.entity, {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
    });
  }
}
