import { ErrorCode } from '@project/shared';
import { ConflictError, UnauthorizedError } from '../../../../shared/errors/app.error.js';
import { UserRepository } from '../../../user/user.repository.js';
import { ResendEmailConfirmationCommand } from './resend-email-confirmation.command.js';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationService } from '../../email-confirmation.service.js';

@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationHandler implements ICommandHandler<ResendEmailConfirmationCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}
  async execute(command: ResendEmailConfirmationCommand) {
    const user = await this.userRepository.findById(command.currentUser.id);
    if (!user) throw new UnauthorizedError();
    if (user.emailConfirmed)
      throw new ConflictError('Email is already confirmed', ErrorCode.ALREADY_CONFIRMED);
    await this.emailConfirmationService.resend(user);
  }
}
