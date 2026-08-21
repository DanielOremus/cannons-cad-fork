import { Command } from '@nestjs/cqrs';
import { LoginUserDto } from '../../dto/login-user.dto';
import { UserAuthResponse } from '../../../../shared/types/user';

export class LoginUserCommand extends Command<UserAuthResponse> {
  constructor(readonly dto: LoginUserDto) {
    super();
  }
}
