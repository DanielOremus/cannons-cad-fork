import { Command } from '@nestjs/cqrs';
import { PermissionMeta } from '@project/shared';

export class DeleteCitationCommand extends Command<void> {
  constructor(
    readonly id: number,
    readonly userId: string,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
