import { Query } from '@nestjs/cqrs';
import { SearchCharacterDto, SearchCharacterResponseDto } from '../../dto/search-character.dto';

export class SearchCharacterQuery extends Query<SearchCharacterResponseDto> {
  constructor(readonly dto: SearchCharacterDto) {
    super();
  }
}
