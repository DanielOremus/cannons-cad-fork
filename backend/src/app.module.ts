import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './core/database/prisma.module';
import { AppConfigModule } from './core/config/config.module';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './core/redis/redis.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, UserModule, AuthModule],
})
export class AppModule {}
