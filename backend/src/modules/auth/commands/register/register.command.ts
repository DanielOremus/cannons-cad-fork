import { Command } from '@nestjs/cqrs';
import { UserAuthResponse } from '../../../../shared/types/user';
import { RegisterUserDto } from '../../dto/register-user.dto';

export class RegisterUserCommand extends Command<UserAuthResponse> {
  constructor(readonly dto: RegisterUserDto) {
    super();
  }
}
