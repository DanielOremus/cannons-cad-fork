import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { TokenModule } from '../../shared/modules/token/token.module';
import { DatabaseModule } from '../../core/database/database.module';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  imports: [UserModule, EmailModule, TokenModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, EmailConfirmationService],
})
export class AuthModule {}
