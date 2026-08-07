import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterRepository } from '../character.repository';
import { EntityManager, Populate } from '@mikro-orm/postgresql';
import { SearchCharacterDto } from '../dto/search-character.dto';
import { CreateCharacterInput } from '../inputs/create-character.input';
import { CharacterPopulate } from '../character.repository';

@Injectable()
export class OrmCharacterRepository extends CharacterRepository {
  private readonly entity = CharacterEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findByNameAndDob(
    data: SearchCharacterDto,
    populate?: CharacterPopulate[],
  ): Promise<CharacterEntity | null> {
    return await this.em.findOne(
      this.entity,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
      },
      { populate },
    );
  }
  async create(data: CreateCharacterInput): Promise<CharacterEntity> {
    return await this.em.create(this.entity, data);
  }
  async delete(entity: CharacterEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
