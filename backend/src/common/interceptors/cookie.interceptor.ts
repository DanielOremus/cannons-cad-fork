import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { COOKEY_KEY, prepareTokenCookie } from '../../modules/auth/cookie.helper.js';
import { AppConfigService } from '../../core/config/config.service.js';
import { Reflector } from '@nestjs/core';
import {
  CLEAR_REFRESH_COOKIE_KEY,
  SET_REFRESH_COOKIE_KEY,
} from '../decorators/refresh-cookie.decorator.js';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AppConfigService) private readonly config: AppConfigService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    const setRefreshCookie = this.reflector.get<boolean>(
      SET_REFRESH_COOKIE_KEY,
      context.getHandler(),
    );
    const clearRefreshCookie = this.reflector.get<boolean>(
      CLEAR_REFRESH_COOKIE_KEY,
      context.getHandler(),
    );

    console.log(`clear: ${clearRefreshCookie}`);

    return next.handle().pipe(
      tap({
        next: () => {
          if (setRefreshCookie && response.locals.refreshToken) {
            const cookie = prepareTokenCookie(
              response.locals.refreshToken,
              this.config.jwt.refresh.ttl * 1000,
            );
            response.cookie(COOKEY_KEY, cookie.value, cookie.options);
          }
          if (clearRefreshCookie) {
            response.clearCookie(COOKEY_KEY);
          }
        },
        error: () => {
          response.clearCookie(COOKEY_KEY);
        },
      }),
    );
  }
}
