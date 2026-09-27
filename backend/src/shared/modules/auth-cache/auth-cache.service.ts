import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../core/redis/redis.service.js';
import { Permission, UserRole, UserStatus } from '@project/shared';
import { AppConfigService } from '../../../core/config/config.service.js';

type UserSession = {
  status: UserStatus;
  roles: UserRole[];
};

@Injectable()
export class AuthCacheService {
  private accessTokenTtl: number;

  private userRolesKey(userId: string) {
    return `user:${userId}:roles`;
  }
  private userPermissionsKey(userId: string) {
    return `user:${userId}:permissions`;
  }
  private userSessionKey(userId: string) {
    return `user:${userId}:session`;
  }

  constructor(
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {
    this.accessTokenTtl = config.jwt.access.ttl;
  }
  //Session caching
  async cacheUserSession(userId: string, payload: UserSession) {
    await this.redis.client.setEx(
      this.userSessionKey(userId),
      this.accessTokenTtl,
      JSON.stringify(payload),
    );
  }

  async getUserSession(userId: string) {
    const data = await this.redis.client.get(this.userSessionKey(userId));
    return data ? (JSON.parse(data) as UserSession) : null;
  }

  //Roles caching
  async cacheUserRoles(userId: string, roles: UserRole[]) {
    await this.redis.client.setEx(
      this.userRolesKey(userId),
      this.config.jwt.access.ttl,
      JSON.stringify(roles),
    );
  }

  async getUserRoles(userId: string) {
    const value = await this.redis.client.get(this.userRolesKey(userId));
    return value ? (JSON.parse(value) as UserRole[]) : null;
  }

  //Permissions caching
  async cacheUserPermissions(userId: string, permissions: Permission[]) {
    await this.redis.client.setEx(
      this.userPermissionsKey(userId),
      this.config.jwt.access.ttl,
      JSON.stringify(permissions),
    );
  }

  async getUserPermissions(userId: string) {
    const value = await this.redis.client.get(this.userPermissionsKey(userId));
    return value ? (JSON.parse(value) as Permission[]) : null;
  }
}
