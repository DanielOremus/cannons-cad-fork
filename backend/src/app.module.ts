import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import { ModulesModule } from './modules/modules.module.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { SharedModule } from './shared/modules/shared.module.js';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard.js';

@Module({
  imports: [CqrsModule.forRoot(), CoreModule, SharedModule, ModulesModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
