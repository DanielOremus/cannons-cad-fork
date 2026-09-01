import { Module } from '@nestjs/common';
import { OwnershipModule } from './ownership/ownership.module.js';
import { AuthCacheModule } from './auth-cache/auth-cache.module.js';
import { TokenModule } from './token/token.module.js';
import { AuthSessionModule } from './auth-session/auth-session.module.js';

@Module({
  imports: [TokenModule, OwnershipModule, AuthCacheModule, AuthSessionModule],
  exports: [TokenModule, OwnershipModule, AuthCacheModule, AuthSessionModule],
})
export class SharedModule {}
