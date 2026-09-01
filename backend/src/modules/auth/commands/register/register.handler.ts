import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register.command';
import { UserRepository } from '../../../user/user.repository';
import { nameof, ValidationIssue } from '@project/shared';
import { ValidationError } from '../../../../shared/errors/app.error';
import { EmailConfirmationService } from '../../email-confirmation.service';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import bcrypt from 'bcrypt';
import { AuthSessionService } from '../../../../shared/modules/auth-session/auth-session.service';
import { UserMapper } from '../../../user/user.mapper';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly authSessionService: AuthSessionService,
    private readonly userMapper: UserMapper,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: RegisterUserCommand) {
    const exists = await this.userRepository.findByEmail(command.dto.email);
    if (exists) {
      const issue: ValidationIssue<'not_unique'> = {
        code: 'not_unique',
        field: nameof<typeof command.dto>('email'),
        params: undefined,
      };
      throw new ValidationError([issue]);
    }

    const passwordHash = await bcrypt.hash(command.dto.password, 10);

    const user = await this.uow.withTransaction(async () => {
      const user = await this.userRepository.create({
        email: command.dto.email,
        name: command.dto.name,
        passwordHash,
      });
      await this.emailConfirmationService.create(user);

      return user;
    });

    const { refresh, access } = await this.authSessionService.createSession(user);

    return { refresh, access, user: this.userMapper.toProfileDto(user) };
  }
}
