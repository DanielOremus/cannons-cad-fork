import { Query } from '@nestjs/cqrs';
import { PaginatedList, PaginationDto, PermissionMeta } from '@project/shared';
import { CharacterListItemDto } from '../../dto/get-character.dto.js';

export class GetCharactersListQuery extends Query<PaginatedList<CharacterListItemDto>> {
  constructor(
    readonly targetUserId: string,
    readonly currentUserId: string,
    readonly permissionMeta: PermissionMeta,
    readonly pagination: PaginationDto,
  ) {
    super();
  }
}
