import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { AppConfigService } from './config/config.service';
import { MailerModule } from './mailer/mailer.module';
import { AppThrottlerModule } from './throttler/throttler.module';

@Module({
  imports: [
    AppConfigModule,
    AppThrottlerModule,
    DatabaseModule,
    RedisModule,
    MailerModule,
    BullModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: {
          host: config.redis.host,
          port: config.redis.port,
          username: config.redis.user,
          password: config.redis.password,
        },
      }),
    }),
  ],
})
export class CoreModule {}
