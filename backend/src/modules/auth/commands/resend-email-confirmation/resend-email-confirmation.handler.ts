import { ErrorCode } from '@project/shared';
import { ConflictError, UnauthorizedError } from '../../../../shared/errors/app.error';
import { UserRepository } from '../../../user/user.repository';
import { ResendEmailConfirmationCommand } from './resend-email-confirmation.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationService } from '../../email-confirmation.service';

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
