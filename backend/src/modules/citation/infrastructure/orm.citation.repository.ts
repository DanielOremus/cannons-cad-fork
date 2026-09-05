import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CitationPopulate, CitationRepository } from '../citation.repository.js';
import { CitationEntity } from '../entities/citation.entity.js';
import { PaginationDto } from '@project/shared';
import { Injectable } from '@nestjs/common';
import { CreateCitationInput } from '../inputs/create-citation.input.js';
import { UpdateCitationDto } from '../dto/update-citation.dto.js';

@Injectable()
export class OrmCitationRepository implements CitationRepository {
  private readonly entity = CitationEntity;
  constructor(private readonly em: EntityManager) {}
  async findByCharacter(
    characterId: number,
    pagination: PaginationDto,
    populate: CitationPopulate[] = ['charges', 'issuedBy'],
  ): Promise<{ items: CitationEntity[]; total: number }> {
    const { limit, page } = pagination;
    const itemsPromise = this.em.find(
      this.entity,
      { issuedCharacter: characterId },
      { limit, offset: (page - 1) * limit, populate, orderBy: { issuedAt: 'DESC' } },
    );
    const countPromise = this.em.count(this.entity, { issuedCharacter: characterId });

    const [citations, total] = await Promise.all([itemsPromise, countPromise]);
    return { items: citations, total };
  }
  async findById(id: number, populate?: CitationPopulate[]): Promise<CitationEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }
  async issue(input: CreateCitationInput): Promise<CitationEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: CitationEntity, input: UpdateCitationDto): Promise<CitationEntity> {
    return await wrap(entity).assign(input);
  }
  async delete(entity: CitationEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
