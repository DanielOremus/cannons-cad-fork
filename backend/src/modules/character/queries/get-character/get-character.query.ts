import { Query } from '@nestjs/cqrs';
import { CharacterDto } from '../../dto/get-character.dto.js';
import { PermissionMeta } from '@project/shared';

export class GetCharacterQuery extends Query<CharacterDto> {
  constructor(
    readonly characterId: number,
    readonly userId: string,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
