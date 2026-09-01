import { Module } from '@nestjs/common';
import { OwnershipModule } from './ownership/ownership.module';
import { AuthCacheModule } from './auth-cache/auth-cache.module';
import { TokenModule } from './token/token.module';
import { AuthSessionModule } from './auth-session/auth-session.module';

@Module({
  imports: [TokenModule, OwnershipModule, AuthCacheModule, AuthSessionModule],
  exports: [TokenModule, OwnershipModule, AuthCacheModule, AuthSessionModule],
})
export class SharedModule {}
