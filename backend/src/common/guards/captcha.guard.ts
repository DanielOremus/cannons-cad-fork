import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CAPTCHA_KEY } from '../decorators/require-captcha';
import { Request } from 'express';
import { AppConfigService } from '../../core/config/config.service';
import { AppError } from '../../shared/errors/app.error';
import { ErrorCode } from '@project/shared';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: AppConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const tokenField = this.reflector.get<string>(CAPTCHA_KEY, context.getHandler());

    const captchaToken = request.body[tokenField];

    // if(typeof captchaToken !== "string" || captchaToken.trim() === ""){}

    const cloudflareRes = await fetch(this.config.turnstile.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: this.config.turnstile.secret,
        response: captchaToken,
      }),
    });

    const result = await cloudflareRes.json();
    if (!result.success)
      throw new AppError('Captcha validation failed', ErrorCode.VALIDATION_FAILED);
    return true;
  }
}
