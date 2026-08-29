import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../../../core/redis/redis.module';
import { TokenStoreService } from './token-store.service';

@Global()
@Module({
  imports: [JwtModule, RedisModule],
  providers: [TokenService, TokenStoreService],
  exports: [TokenService, TokenStoreService],
})
export class TokenModule {}
