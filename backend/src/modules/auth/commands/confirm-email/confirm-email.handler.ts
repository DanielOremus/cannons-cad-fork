import { ErrorCode } from '@project/shared';
import { ConflictError, UnauthorizedError } from '../../../../shared/errors/app.error';
import { UserRepository } from '../../../user/user.repository';
import { ConfirmEmailCommand } from './confirm-email.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationService } from '../../email-confirmation.service';

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
