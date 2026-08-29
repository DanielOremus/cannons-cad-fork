import { Module } from '@nestjs/common';
import { OwnershipModule } from './ownership/ownership.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [TokenModule, OwnershipModule, PermissionsModule],
  exports: [TokenModule, OwnershipModule, PermissionsModule],
})
export class SharedModule {}
