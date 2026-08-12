import { RedisService } from '../../../../core/redis/redis.service';
import { LogoutUserCommand } from './logout.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly redisService: RedisService) {}
  async execute(command: LogoutUserCommand) {
    await this.redisService.revokeFamily(command.userId, command.tokenFamilyId);
  }
}
