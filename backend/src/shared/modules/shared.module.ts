import { Module } from '@nestjs/common';
import { OwnershipModule } from './ownership/ownership.module';
import { AuthCacheModule } from './auth-cache/auth-cache.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [TokenModule, OwnershipModule, AuthCacheModule],
  exports: [TokenModule, OwnershipModule, AuthCacheModule],
})
export class SharedModule {}
