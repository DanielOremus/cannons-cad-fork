import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../core/redis/redis.service';
import { Permission, UserRole } from '@project/shared';
import { AppConfigService } from '../../../core/config/config.service';

@Injectable()
export class AuthCacheService {
  private userRolesKey(userId: string) {
    return `user:${userId}:roles`;
  }
  private userPermissionsKey(userId: string) {
    return `user:${userId}:permissions`;
  }

  constructor(
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {}

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
