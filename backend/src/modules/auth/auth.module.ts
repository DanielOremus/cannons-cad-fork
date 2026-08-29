import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { TokenModule } from '../../shared/modules/token/token.module';
import { DatabaseModule } from '../../core/database/database.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { AuthSessionService } from './auth-session.service';
import { LoginUserHandler } from './commands/login/login.handler';
import { RegisterUserHandler } from './commands/register/register.handler';
import { LogoutUserHandler } from './commands/logout/logout.handler';
import { RefreshSessionHandler } from './commands/refresh-session/refresh-session.handler';
import { ResendEmailConfirmationHandler } from './commands/resend-email-confirmation/resend-email-confirmation.handler';
import { ConfirmEmailHandler } from './commands/confirm-email/confirm-email.handler';
import { PermissionsModule } from '../../shared/modules/permissions/permissions.module';

const commandHandlers = [
  LoginUserHandler,
  RegisterUserHandler,
  LogoutUserHandler,
  RefreshSessionHandler,
  ResendEmailConfirmationHandler,
  ConfirmEmailHandler,
];

@Module({
  imports: [UserModule, EmailModule, TokenModule, PermissionsModule, DatabaseModule],
  controllers: [AuthController],
  providers: [...commandHandlers, EmailConfirmationService, AuthSessionService],
})
export class AuthModule {}
