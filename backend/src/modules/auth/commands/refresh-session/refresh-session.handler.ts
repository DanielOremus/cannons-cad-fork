import { RedisService } from '../../../../core/redis/redis.service';
import { UnauthorizedError } from '../../../../shared/errors/app.error';
import { TokenService } from '../../../../shared/modules/token/token.service';
import { UserMapper } from '../../../user/user.mapper';
import { UserRepository } from '../../../user/user.repository';
import { AuthSessionService } from '../../auth-session.service';
import { RefreshSessionCommand } from './refresh-session.command';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RefreshSessionCommand)
export class RefreshSessionHandler implements ICommandHandler<RefreshSessionCommand> {
  constructor(
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(command: RefreshSessionCommand) {
    const { success, data } = this.tokenService.tryVerify('refresh', command.refreshToken);
    if (!success) throw new UnauthorizedError();
    const tokenExists = await this.redisService.getRToken(data.jti);
    if (!tokenExists) throw new UnauthorizedError();

    const familyExists = await this.redisService.familyExists(tokenExists.familyId);
    if (!familyExists) throw new UnauthorizedError();

    if (tokenExists.used) {
      await this.redisService.revokeUserFamilies(tokenExists.userId);
      throw new UnauthorizedError();
    }

    const user = await this.userRepository.findById(tokenExists.userId);
    if (!user) throw new UnauthorizedError();

    await this.redisService.revokeRToken(tokenExists.jti);

    const { refresh, access } = await this.authSessionService.updateSession(
      user,
      tokenExists.familyId,
    );

    return { refresh, access, user: this.userMapper.toProfileDto(user) };
  }
}
