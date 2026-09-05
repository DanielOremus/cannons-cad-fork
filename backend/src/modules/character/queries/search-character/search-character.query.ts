import { Query } from '@nestjs/cqrs';
import { SearchCharacterDto, SearchCharacterResponseDto } from '../../dto/search-character.dto.js';
import { PermissionMeta } from '@project/shared';

export class SearchCharacterQuery extends Query<SearchCharacterResponseDto> {
  constructor(
    readonly dto: SearchCharacterDto,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
