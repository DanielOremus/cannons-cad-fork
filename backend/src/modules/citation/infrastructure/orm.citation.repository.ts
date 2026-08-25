import { EntityManager } from '@mikro-orm/postgresql';
import { CitationRepository } from '../citation.repository';
import { CitationEntity } from '../entities/citation.entity';
import { PaginationDto } from '@project/shared';
import { Injectable } from '@nestjs/common';
import { CreateCitationInput } from '../inputs/create-citation.input';

@Injectable()
export class OrmCitationRepository extends CitationRepository {
  private readonly entity = CitationEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: CitationEntity[]; total: number }> {
    const { limit, page } = pagination;
    const itemsPromise = this.em.find(
      this.entity,
      { issuedCharacter: characterId },
      { limit, offset: (page - 1) * limit, populate: ['charges'] },
    );
    const countPromise = this.em.count(this.entity, { issuedCharacter: characterId });

    const [citations, total] = await Promise.all([itemsPromise, countPromise]);
    return { items: citations, total };
  }
  async issue(input: CreateCitationInput): Promise<CitationEntity> {
    return await this.em.create(this.entity, input);
  }
}
