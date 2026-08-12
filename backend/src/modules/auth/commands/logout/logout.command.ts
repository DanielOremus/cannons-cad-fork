import { Command } from '@nestjs/cqrs';

export class LogoutUserCommand extends Command<void> {
  constructor(
    readonly userId: string,
    readonly tokenFamilyId: string,
  ) {
    super();
  }
}
