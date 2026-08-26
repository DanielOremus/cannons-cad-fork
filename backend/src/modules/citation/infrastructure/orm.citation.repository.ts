import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CitationPopulate, CitationRepository } from '../citation.repository';
import { CitationEntity } from '../entities/citation.entity';
import { PaginationDto } from '@project/shared';
import { Injectable } from '@nestjs/common';
import { CreateCitationInput } from '../inputs/create-citation.input';
import { UpdateCitationDto } from '../dto/update-citation.dto';

@Injectable()
export class OrmCitationRepository extends CitationRepository {
  private readonly entity = CitationEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async findByCharacter(
    characterId: number,
    pagination: PaginationDto,
    populate: CitationPopulate[] = ['charges', 'issuedBy'],
  ): Promise<{ items: CitationEntity[]; total: number }> {
    const { limit, page } = pagination;
    const itemsPromise = this.em.find(
      this.entity,
      { issuedCharacter: characterId },
      { limit, offset: (page - 1) * limit, populate },
    );
    const countPromise = this.em.count(this.entity, { issuedCharacter: characterId });

    const [citations, total] = await Promise.all([itemsPromise, countPromise]);
    return { items: citations, total };
  }
  async findById(id: number): Promise<CitationEntity | null> {
    return await this.em.findOne(this.entity, { id });
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
