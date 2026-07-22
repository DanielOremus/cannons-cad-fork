import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { AppConfigService } from './config/config.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
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
