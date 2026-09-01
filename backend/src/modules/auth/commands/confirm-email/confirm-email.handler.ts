import { ErrorCode } from '@project/shared';
import { ConflictError, UnauthorizedError } from '../../../../shared/errors/app.error.js';
import { UserRepository } from '../../../user/user.repository.js';
import { ConfirmEmailCommand } from './confirm-email.command.js';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationService } from '../../email-confirmation.service.js';

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler implements ICommandHandler<ConfirmEmailCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}
  async execute(command: ConfirmEmailCommand) {
    const user = await this.userRepository.findById(command.currentUser.id);
    if (!user) throw new UnauthorizedError();
    if (user.emailConfirmed)
      throw new ConflictError('Email is already confirmed', ErrorCode.ALREADY_CONFIRMED);
    await this.emailConfirmationService.confirm(user, command.confirmationCode);
  }
}
