import { LoginUserCommand } from './login.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../user/user.repository';
import { UnauthorizedError } from '../../../../shared/errors/app.error';
import { UserMapper } from '../../../user/user.mapper';
import { AuthSessionService } from '../../../../shared/modules/auth-session/auth-session.service';
import bcrypt from 'bcrypt';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(command: LoginUserCommand) {
    const user = await this.userRepository.findByEmail(command.dto.email);
    if (!user) throw new UnauthorizedError();
    const passwordCorrect = await bcrypt.compare(command.dto.password, user.passwordHash);
    if (!passwordCorrect) throw new UnauthorizedError();

    const { refresh, access } = await this.authSessionService.createSession(user);

    return { refresh, access, user: this.userMapper.toProfileDto(user) };
  }
}
