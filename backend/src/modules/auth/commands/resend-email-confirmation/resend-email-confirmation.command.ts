import { Command } from '@nestjs/cqrs';
import { AuthUser } from '../../../../shared/types/user.js';

export class ResendEmailConfirmationCommand extends Command<void> {
  constructor(readonly currentUser: AuthUser) {
    super();
  }
}
