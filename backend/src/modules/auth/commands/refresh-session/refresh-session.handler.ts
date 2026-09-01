import { UnauthorizedError } from '../../../../shared/errors/app.error.js';
import { TokenStoreService } from '../../../../shared/modules/token/token-store.service.js';
import { TokenService } from '../../../../shared/modules/token/token.service.js';
import { UserMapper } from '../../../user/user.mapper.js';
import { UserRepository } from '../../../user/user.repository.js';
import { AuthSessionService } from '../../../../shared/modules/auth-session/auth-session.service.js';
import { RefreshSessionCommand } from './refresh-session.command.js';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RefreshSessionCommand)
export class RefreshSessionHandler implements ICommandHandler<RefreshSessionCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly tokenStore: TokenStoreService,
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(command: RefreshSessionCommand) {
    const { success, data } = this.tokenService.tryVerify('refresh', command.refreshToken);
    if (!success) throw new UnauthorizedError();
    const tokenExists = await this.tokenStore.getRToken(data.jti);
    if (!tokenExists) throw new UnauthorizedError();

    const familyExists = await this.tokenStore.familyExists(tokenExists.familyId);
    if (!familyExists) throw new UnauthorizedError();

    if (tokenExists.used) {
      await this.tokenStore.revokeUserFamilies(tokenExists.userId);
      throw new UnauthorizedError();
    }

    const user = await this.userRepository.findById(tokenExists.userId);
    if (!user) throw new UnauthorizedError();

    await this.tokenStore.revokeRToken(tokenExists.jti);

    const { refresh, access } = await this.authSessionService.updateSession(
      user,
      tokenExists.familyId,
    );

    return { refresh, access, user: this.userMapper.toProfileDto(user) };
  }
}
