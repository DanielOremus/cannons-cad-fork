import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from '../config/config.module.js';
import { AppConfigService } from '../config/config.service.js';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { appThrottlers } from './throttlers.js';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        throttlers: [appThrottlers.default],
        storage: new ThrottlerStorageRedisService({
          host: config.redis.host,
          port: config.redis.port,
          username: config.redis.user,
          password: config.redis.password,
        }),
      }),
    }),
  ],
})
export class AppThrottlerModule {}
