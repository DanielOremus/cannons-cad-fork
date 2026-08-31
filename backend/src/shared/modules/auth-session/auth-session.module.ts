import { Module } from '@nestjs/common';
import { AuthSessionService } from './auth-session.service';
import { TokenModule } from '../token/token.module';
import { AuthCacheModule } from '../auth-cache/auth-cache.module';
import { TestGateway } from './test.gateway';

@Module({
  imports: [TokenModule, AuthCacheModule],
  providers: [AuthSessionService, TestGateway],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
