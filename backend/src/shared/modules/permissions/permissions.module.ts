import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../../../core/redis/redis.module';
import { PermissionsCacheService } from './permissions-cache.service';

@Global()
@Module({
  imports: [RedisModule],
  providers: [PermissionsCacheService],
  exports: [PermissionsCacheService],
})
export class PermissionsModule {}
