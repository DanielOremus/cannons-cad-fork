import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetCharacterCitationsQuery } from './get-character-citations.query';
import { CitationRepository } from '../../citation.repository';
import { PaginatedList, CitationDto } from '@project/shared';
import { CitationMapper } from '../../citation.mapper';

@QueryHandler(GetCharacterCitationsQuery)
export class GetCharacterCitationsHandler implements IQueryHandler<GetCharacterCitationsQuery> {
  constructor(
    private readonly citationRepository: CitationRepository,
    private readonly citationMapper: CitationMapper,
  ) {}
  async execute(query: GetCharacterCitationsQuery): Promise<PaginatedList<CitationDto>> {
    const citations = await this.citationRepository.findByCharacter(
      query.characterId,
      query.pagination,
    );
    const citationsListDto = this.citationMapper.toDtoList(citations.items);
    return {
      total: citations.total,
      items: citationsListDto,
      page: query.pagination.page,
      limit: query.pagination.limit,
    };
  }
}
