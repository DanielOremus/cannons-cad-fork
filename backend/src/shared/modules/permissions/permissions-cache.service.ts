import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../core/redis/redis.service';
import { Permission } from '@project/shared';
import { AppConfigService } from '../../../core/config/config.service';

@Injectable()
export class PermissionsCacheService {
  private userPermissionsKey(userId: string) {
    return `user:${userId}:permissions`;
  }

  constructor(
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {}

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
    if (!value) return [];
    return JSON.parse(value) as Permission[];
  }
}
