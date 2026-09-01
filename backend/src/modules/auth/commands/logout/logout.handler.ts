import { TokenStoreService } from '../../../../shared/modules/token/token-store.service.js';
import { LogoutUserCommand } from './logout.command.js';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly tokenStore: TokenStoreService) {}
  async execute(command: LogoutUserCommand) {
    await this.tokenStore.revokeFamily(command.userId, command.tokenFamilyId);
  }
}
