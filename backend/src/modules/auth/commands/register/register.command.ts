import { Command } from '@nestjs/cqrs';
import { UserAuthResponse } from '../../../../shared/types/user.js';
import { RegisterUserDto } from '../../dto/register-user.dto.js';

export class RegisterUserCommand extends Command<UserAuthResponse> {
  constructor(readonly dto: RegisterUserDto) {
    super();
  }
}
