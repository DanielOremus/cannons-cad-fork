import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule],
})
export class CoreModule {}
