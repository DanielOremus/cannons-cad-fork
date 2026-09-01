import { Command } from '@nestjs/cqrs';
import { LoginUserDto } from '../../dto/login-user.dto.js';
import { UserAuthResponse } from '../../../../shared/types/user.js';

export class LoginUserCommand extends Command<UserAuthResponse> {
  constructor(readonly dto: LoginUserDto) {
    super();
  }
}
