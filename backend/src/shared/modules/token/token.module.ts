import { Module } from '@nestjs/common';
import { TokenService } from './token.service.js';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../../../core/redis/redis.module.js';
import { TokenStoreService } from './token-store.service.js';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [TokenService, TokenStoreService],
  exports: [TokenService, TokenStoreService],
})
export class TokenModule {}
