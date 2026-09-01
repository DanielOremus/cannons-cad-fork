import { Module } from '@nestjs/common';
import { AuthSessionService } from './auth-session.service.js';
import { TokenModule } from '../token/token.module.js';
import { AuthCacheModule } from '../auth-cache/auth-cache.module.js';
import { TestGateway } from './test.gateway.js';

@Module({
  imports: [TokenModule, AuthCacheModule],
  providers: [AuthSessionService, TestGateway],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
