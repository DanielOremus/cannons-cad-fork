import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { type Response } from 'express';
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
  async logout(@Res() res: Response) {
    res.clearCookie(COOKEY_KEY);
  }
  @Post('/refresh')
  async refresh() {}
}
