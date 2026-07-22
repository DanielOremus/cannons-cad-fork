import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { prepareTokenCookie } from '../../modules/auth/cookie.helper';
import { AppConfigService } from '../../core/config/config.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    @Inject(AppConfigService) private readonly config: AppConfigService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap({
        next: () => {
          if (response.locals.refreshToken) {
            const cookie = prepareTokenCookie(
              response.locals.refreshToken,
              this.config.jwt.refresh.ttl * 1000,
            );
            response.cookie(cookie.key, cookie.value, cookie.options);
          }
        },
      }),
    );
  }
}
