import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import type { Request, Response } from 'express';
import { COOKEY_KEY } from './cookie.helper';
import { AuthGuard } from '../../common/guards/auth.guard';
import {
  RequireConfirmedEmailOnly,
  SkipActiveCheck,
} from '../../common/decorators/account.decorator';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { UserMapper } from '../user/user.mapper';
import { AuthInterceptor } from '../../common/interceptors/auth.interceptor';
import {
  ClearRefreshCookie,
  SetRefreshCookie,
} from '../../common/decorators/refresh-cookie.decorator';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userMapper: UserMapper,
  ) {}
  @Post('/register')
  @SetRefreshCookie()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(201)
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } =
      await this.authService.register(registerDto);
    res.locals.refreshToken = refresh;

    return { access, user: this.userMapper.toPrivateProfileDto(user) };
  }
  @Post('/login')
  @SetRefreshCookie()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh, access, user } = await this.authService.login(loginDto);
    res.locals.refreshToken = refresh;

    return { access, user: this.userMapper.toPrivateProfileDto(user) };
  }
  @Post('/logout')
  @UseGuards(AuthGuard)
  @RequireConfirmedEmailOnly()
  @ClearRefreshCookie()
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user!.id, req.user!.familyId);
    res.clearCookie(COOKEY_KEY);
  }
  @Post('/refresh')
  @HttpCode(200)
  @SetRefreshCookie()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { refresh, access } = await this.authService.refresh(
        req.signedCookies[COOKEY_KEY],
      );
      res.locals.refreshToken = refresh;

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
