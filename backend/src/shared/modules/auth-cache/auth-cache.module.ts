import { Module } from '@nestjs/common';
import { RedisModule } from '../../../core/redis/redis.module.js';
import { AuthCacheService } from './auth-cache.service.js';

@Module({
  imports: [RedisModule],
  providers: [AuthCacheService],
  exports: [AuthCacheService],
})
export class AuthCacheModule {}
