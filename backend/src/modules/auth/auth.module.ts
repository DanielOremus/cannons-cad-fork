import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { EmailModule } from '../email/email.module.js';
import { TokenModule } from '../../shared/modules/token/token.module.js';
import { DatabaseModule } from '../../core/database/database.module.js';
import { EmailConfirmationService } from './email-confirmation.service.js';
import { LoginUserHandler } from './commands/login/login.handler.js';
import { RegisterUserHandler } from './commands/register/register.handler.js';
import { LogoutUserHandler } from './commands/logout/logout.handler.js';
import { RefreshSessionHandler } from './commands/refresh-session/refresh-session.handler.js';
import { ResendEmailConfirmationHandler } from './commands/resend-email-confirmation/resend-email-confirmation.handler.js';
import { ConfirmEmailHandler } from './commands/confirm-email/confirm-email.handler.js';
import { AuthCacheModule } from '../../shared/modules/auth-cache/auth-cache.module.js';
import { AuthSessionModule } from '../../shared/modules/auth-session/auth-session.module.js';

const commandHandlers = [
  LoginUserHandler,
  RegisterUserHandler,
  LogoutUserHandler,
  RefreshSessionHandler,
  ResendEmailConfirmationHandler,
  ConfirmEmailHandler,
];

@Module({
  imports: [
    UserModule,
    EmailModule,
    TokenModule,
    AuthCacheModule,
    AuthSessionModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [...commandHandlers, EmailConfirmationService],
})
export class AuthModule {}
