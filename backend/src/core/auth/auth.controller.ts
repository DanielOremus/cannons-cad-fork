import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/register')
  async register() {}
  @Get('/login')
  async login() {}
  @Get('/logout')
  async logout() {}
  @Get('/refresh')
  async refresh() {}
}
