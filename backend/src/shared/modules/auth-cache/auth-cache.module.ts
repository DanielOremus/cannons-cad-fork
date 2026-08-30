import { Module } from '@nestjs/common';
import { RedisModule } from '../../../core/redis/redis.module';
import { AuthCacheService } from './auth-cache.service';

@Module({
  imports: [RedisModule],
  providers: [AuthCacheService],
  exports: [AuthCacheService],
})
export class AuthCacheModule {}
