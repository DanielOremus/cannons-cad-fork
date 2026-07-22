import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { TokenModule } from '../../shared/modules/token/token.module';
import { PrismaModule } from '../../core/database/prisma.module';

@Module({
  imports: [UserModule, EmailModule, TokenModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
