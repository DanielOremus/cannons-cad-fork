import { Body, Controller, HttpCode, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { Request, Response } from 'express';
import { COOKEY_KEY } from './cookie.helper';
import { AuthInterceptor } from '../../common/interceptors/auth.interceptor';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  RequireConfirmedEmailOnly,
  SkipActiveCheck,
} from '../../common/decorators/account.decorator';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import {
  ClearRefreshCookie,
  SetRefreshCookie,
} from '../../common/decorators/refresh-cookie.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register/register.command';
import { LoginUserCommand } from './commands/login/login.command';
import { LogoutUserCommand } from './commands/logout/logout.command';
import { RefreshSessionCommand } from './commands/refresh-session/refresh-session.command';
import { ConfirmEmailCommand } from './commands/confirm-email/confirm-email.command';
import { ResendEmailConfirmationCommand } from './commands/resend-email-confirmation/resend-email-confirmation.command';
import { Public } from '../../common/decorators/public-route.decorator';
import { Throttle } from '@nestjs/throttler';
import { appThrottlers } from '../../core/throttler/throttlers';

@Controller('/auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('/register')
  @Public()
  @Throttle({ default: appThrottlers.register })
  @SetRefreshCookie()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(201)
  async register(
    @Body(new ZodValidationPipe(RegisterUserDto.schema)) registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } = await this.commandBus.execute(
      new RegisterUserCommand(registerDto),
    );
    res.locals.refreshToken = refresh;

    return { access, user };
  }
  @Post('/login')
  @Public()
  @Throttle({ default: appThrottlers.login })
  @SetRefreshCookie()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(LoginUserDto.schema)) loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } = await this.commandBus.execute(new LoginUserCommand(loginDto));
    res.locals.refreshToken = refresh;

    return { access, user };
  }
  @Post('/logout')
  @RequireConfirmedEmailOnly()
  @UseInterceptors(AuthInterceptor)
  @ClearRefreshCookie()
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.commandBus.execute(new LogoutUserCommand(req.user!.id, req.user!.familyId));
    res.clearCookie(COOKEY_KEY);
  }
  @Post('/refresh')
  @Public()
  @Throttle({ default: appThrottlers.refresh })
  @SetRefreshCookie()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const { refresh, access, user } = await this.commandBus.execute(
        new RefreshSessionCommand(req.signedCookies[COOKEY_KEY]),
      );
      res.locals.refreshToken = refresh;

      return { user, access };
    } catch (error) {
      res.clearCookie(COOKEY_KEY);
      throw error;
    }
  }
  @Post('/confirm-email')
  @SkipActiveCheck()
  @HttpCode(204)
  async confirmEmail(
    @Req() req: Request,
    @Body(new ZodValidationPipe(ConfirmEmailDto.schema)) confirmDto: ConfirmEmailDto,
  ) {
    await this.commandBus.execute(new ConfirmEmailCommand(req.user!, confirmDto.code));
  }
  @Post('/resend-code')
  @Throttle({ default: appThrottlers.resendConfirmation })
  @SkipActiveCheck()
  @HttpCode(204)
  async resendEmailConfirmation(@Req() req: Request) {
    await this.commandBus.execute(new ResendEmailConfirmationCommand(req.user!));
  }
}
