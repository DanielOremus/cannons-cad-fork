import { Command } from '@nestjs/cqrs';
import { AuthUser } from '../../../../shared/types/user.js';

export class ConfirmEmailCommand extends Command<void> {
  constructor(
    readonly currentUser: AuthUser,
    readonly confirmationCode: string,
  ) {
    super();
  }
}
