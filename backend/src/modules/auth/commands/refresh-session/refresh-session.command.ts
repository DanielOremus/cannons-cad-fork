import { Command } from '@nestjs/cqrs';
import { UserAuthResponse } from '../../../../shared/types/user.js';

export class RefreshSessionCommand extends Command<UserAuthResponse> {
  constructor(readonly refreshToken: string) {
    super();
  }
}
