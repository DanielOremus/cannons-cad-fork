import { Injectable } from '@nestjs/common';
import { CharacterEntity } from '../entities/character.entity.js';
import { CharacterRepository } from '../character.repository.js';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { SearchCharacterDto } from '../dto/search-character.dto.js';
import { CreateCharacterInput } from '../inputs/create-character.input.js';
import { CharacterPopulate } from '../character.repository.js';
import { UpdateCharacterDto } from '../dto/update-character.dto.js';

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
  async countVehicles(entity: CharacterEntity): Promise<number> {
    return await entity.vehicles.loadCount();
  }
  async countCitations(entity: CharacterEntity): Promise<number> {
    return await entity.citations.loadCount();
  }
  async findById(id: number, populate?: CharacterPopulate[]): Promise<CharacterEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }
  async create(data: CreateCharacterInput): Promise<CharacterEntity> {
    return await this.em.create(this.entity, data);
  }
  async update(entity: CharacterEntity, input: UpdateCharacterDto): Promise<CharacterEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(entity: CharacterEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
