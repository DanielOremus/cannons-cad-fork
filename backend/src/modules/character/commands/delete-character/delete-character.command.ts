import { Command } from '@nestjs/cqrs';
import { PermissionMeta } from '@project/shared';

export class DeleteCharacterCommand extends Command<void> {
  constructor(
    readonly characterId: number,
    readonly userId: string,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
