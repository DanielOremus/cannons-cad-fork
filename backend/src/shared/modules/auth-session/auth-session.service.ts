import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../modules/user/entities/user.entity.js';
import { randomUUID } from 'crypto';
import { TokenPayloads } from '../../types/token.js';
import { TokenService } from '../token/token.service.js';
import { TokenStoreService } from '../token/token-store.service.js';
import { AuthCacheService } from '../auth-cache/auth-cache.service.js';
import { getPermissionsFromRoles } from '@project/shared';
import { AuthUser } from '../../types/user.js';

type ValidateSessionReturnType =
  | { success: true; tokenPayload: TokenPayloads['access']; authUser: AuthUser }
  | { success: false; tokenPayload: null; authUser: null };

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
      emailConfirmed: user.emailConfirmed,
      familyId,
      userId: user.id,
    } satisfies TokenPayloads['access'];

    await Promise.all([
      this.tokenStore.storeRToken(refreshPayload),
      this.authCache.cacheUserSession(user.id, { status: user.status, roles: user.roles }),
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
  async validateSession(token?: string): Promise<ValidateSessionReturnType> {
    const payload = this.tokenService.tryParseBearer(token);
    if (!payload) return { success: false, authUser: null, tokenPayload: null };

    const [familyExists, userSession] = await Promise.all([
      this.tokenStore.familyExists(payload.familyId),
      this.authCache.getUserSession(payload.userId),
    ]);

    if (!familyExists || !userSession)
      return { success: false, authUser: null, tokenPayload: null };

    const userRoles = userSession.roles;
    const userPerms = getPermissionsFromRoles(...userRoles);

    return {
      success: true,
      tokenPayload: payload,
      authUser: {
        familyId: payload.familyId,
        id: payload.userId,
        status: userSession.status,
        roles: userRoles,
        permissions: userPerms,
      },
    };
  }
}
