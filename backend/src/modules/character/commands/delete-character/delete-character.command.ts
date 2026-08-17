import { Command } from '@nestjs/cqrs';
import { PermissionScope } from '@project/shared';

export class DeleteCharacterCommand extends Command<void> {
  constructor(
    readonly characterId: number,
    readonly userId: string,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
