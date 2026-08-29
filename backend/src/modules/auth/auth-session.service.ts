import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { TokenPayloads } from '../../shared/types/token';
import { getPermissionsFromRoles } from '@project/shared';
import { TokenService } from '../../shared/modules/token/token.service';
import { TokenStoreService } from '../../shared/modules/token/token-store.service';
import { PermissionsCacheService } from '../../shared/modules/permissions/permissions-cache.service';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly tokenStore: TokenStoreService,
    private readonly permissionCache: PermissionsCacheService,
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

    await this.tokenStore.storeRToken(refreshPayload);

    const userPerms = Array.from(getPermissionsFromRoles(...user.roles));
    await this.permissionCache.cacheUserPermissions(user.id, userPerms);

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
