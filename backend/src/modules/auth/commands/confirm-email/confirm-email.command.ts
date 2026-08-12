import { Command } from '@nestjs/cqrs';
import { AuthUser } from '../../../../shared/types/user';

export class ConfirmEmailCommand extends Command<void> {
  constructor(
    readonly currentUser: AuthUser,
    readonly confirmationCode: string,
  ) {
    super();
  }
}
