import { Query } from '@nestjs/cqrs';
import { CitationDto, PaginatedList, PaginationDto } from '@project/shared';

export class GetCharacterCitationsQuery extends Query<PaginatedList<CitationDto>> {
  constructor(
    readonly characterId: number,
    readonly pagination: PaginationDto,
  ) {
    super();
  }
}
