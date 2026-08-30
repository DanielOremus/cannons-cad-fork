import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { TokenPayloads } from '../../shared/types/token';
import { TokenService } from '../../shared/modules/token/token.service';
import { TokenStoreService } from '../../shared/modules/token/token-store.service';
import { AuthCacheService } from '../../shared/modules/auth-cache/auth-cache.service';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly tokenStore: TokenStoreService,
    private readonly authCache: AuthCacheService,
  ) {}
  private async createBaseSession(user: UserEntity, familyId: string = randomUUID()) {
    const refreshJti = randomUUID();

    const refreshPayload = {
      jti: refreshJti,
      familyId,
      userId: user.id,
    } satisfies TokenPayloads['refresh'];
    const accessPayload = {
      userStatus: user.status,
      emailConfirmed: user.emailConfirmed,
      familyId,
      userRoles: user.roles,
      userId: user.id,
    } satisfies TokenPayloads['access'];

    await Promise.all([
      this.tokenStore.storeRToken(refreshPayload),
      this.authCache.cacheUserRoles(user.id, user.roles),
    ]);

    const refresh = this.tokenService.generate('refresh', refreshPayload);
    const access = this.tokenService.generate('access', accessPayload);

    return { refresh, access };
  }
  async createSession(user: UserEntity): Promise<{ refresh: string; access: string }> {
    return await this.createBaseSession(user);
  }
  async updateSession(
    user: UserEntity,
    tokenFamilyId: string,
  ): Promise<{ refresh: string; access: string }> {
    return await this.createBaseSession(user, tokenFamilyId);
  }
}
