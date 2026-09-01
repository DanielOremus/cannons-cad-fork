import { Command } from '@nestjs/cqrs';
import { UpdateCharacterDto } from '../../dto/update-character.dto.js';
import { PermissionScope } from '@project/shared';

export class UpdateCharacterCommand extends Command<void> {
  constructor(
    readonly characterId: number,
    readonly userId: string,
    readonly dto: UpdateCharacterDto,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
