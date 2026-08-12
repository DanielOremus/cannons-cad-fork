import { Command } from '@nestjs/cqrs';
import { UserAuthResponse } from '../../../../shared/types/user';

export class RefreshSessionCommand extends Command<UserAuthResponse> {
  constructor(readonly refreshToken: string) {
    super();
  }
}
