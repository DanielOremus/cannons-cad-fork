import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { randomUUID } from 'crypto';
import { TokenPayloads } from '../../types/token';
import { TokenService } from '../token/token.service';
import { TokenStoreService } from '../token/token-store.service';
import { AuthCacheService } from '../auth-cache/auth-cache.service';
import { getPermissionsFromRoles } from '@project/shared';
import { AuthUser } from '../../types/user';

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
  async validateSession(token?: string): Promise<ValidateSessionReturnType> {
    const payload = this.tokenService.tryParseBearer(token);
    if (!payload) return { success: false, authUser: null, tokenPayload: null };

    const [familyExists, redisUserRoles] = await Promise.all([
      this.tokenStore.familyExists(payload.familyId),
      this.authCache.getUserRoles(payload.userId),
    ]);

    if (!familyExists) return { success: false, authUser: null, tokenPayload: null };

    const userRoles = !redisUserRoles ? payload.userRoles : redisUserRoles;
    const userPerms = getPermissionsFromRoles(...userRoles);

    return {
      success: true,
      tokenPayload: payload,
      authUser: {
        familyId: payload.familyId,
        id: payload.userId,
        roles: userRoles,
        permissions: userPerms,
      },
    };
  }
}
