import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { Request, Response } from 'express';
import { AppConfigService } from '../../core/config/config.service';
import { COOKEY_KEY, prepareTokenCookie } from './cookie.helper';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  RequireConfirmedEmailOnly,
  SkipActiveCheck,
} from '../../common/decorators/account.decorator';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}
  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } =
      await this.authService.register(registerDto);

    const cookie = prepareTokenCookie(
      refresh,
      this.config.jwt.refresh.ttl * 1000,
    );
    res.cookie(cookie.key, cookie.value, cookie.options);

    return { access, user };
  }
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } = await this.authService.login(loginDto);

    const cookie = prepareTokenCookie(
      refresh,
      this.config.jwt.refresh.ttl * 1000,
    );
    res.cookie(cookie.key, cookie.value, cookie.options);

    return { access, user };
  }
  @Post('/logout')
  @UseGuards(AuthGuard)
  @RequireConfirmedEmailOnly()
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user!.id, req.user!.familyId);
    res.clearCookie(COOKEY_KEY);
  }
  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { refresh, access } = await this.authService.refresh(
        req.signedCookies[COOKEY_KEY],
      );
      const cookie = prepareTokenCookie(refresh, this.config.jwt.refresh.ttl);
      res.cookie(COOKEY_KEY, cookie);
      return { access };
    } catch (error) {
      res.clearCookie(COOKEY_KEY);
      throw error;
    }
  }
  @Post('/confirm-email')
  @UseGuards(AuthGuard)
  @SkipActiveCheck()
  @HttpCode(204)
  async confirmEmail(@Req() req: Request, @Body() confirmDto: ConfirmEmailDto) {
    await this.authService.confirmEmail(req.user!, confirmDto);
  }
}
