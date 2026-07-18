import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import type { Request, Response } from 'express';
import { AppConfigService } from '../../core/config/config.service';
import { COOKEY_KEY, prepareTokenCookie } from './cookie.helper';

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
  @HttpCode(204)
  async logout(@Res({ passthrough: true }) res: Response) {
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
}
