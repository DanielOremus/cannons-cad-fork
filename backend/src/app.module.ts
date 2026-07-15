import { Module } from '@nestjs/common';
import { UserModule } from './feature/user/user.module';
import { PrismaModule } from './core/database/prisma.module';
import { AppConfigModule } from './core/config/config.module';

@Module({
  imports: [UserModule, PrismaModule, AppConfigModule],
})
export class AppModule {}
