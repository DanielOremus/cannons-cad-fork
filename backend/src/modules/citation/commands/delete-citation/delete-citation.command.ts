import { Command } from '@nestjs/cqrs';
import { PermissionScope } from '@project/shared';

export class DeleteCitationCommand extends Command<void> {
  constructor(
    readonly id: number,
    readonly userId: string,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
