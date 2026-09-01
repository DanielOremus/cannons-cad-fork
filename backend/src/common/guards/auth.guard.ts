import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error';
import { accountActive } from '@project/shared';
import { Reflector } from '@nestjs/core';
import { ACTIVE_CHECK_KEY, EMAIL_CONFIRM_KEY } from '../decorators/account.decorator';
import { PUBLIC_ROUTE_KEY } from '../decorators/public-route.decorator';
import { AuthSessionService } from '../../shared/modules/auth-session/auth-session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authSessionService: AuthSessionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isRoutePublic = this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, context.getHandler());
    if (isRoutePublic) return true;

    const {
      success,
      authUser,
      tokenPayload: payload,
    } = await this.authSessionService.validateSession(request.headers.authorization);
    if (!success) throw new UnauthorizedError();

    request.user = authUser;

    const skipAccountActiveCheck = this.reflector.get<boolean>(
      ACTIVE_CHECK_KEY,
      context.getHandler(),
    );
    if (skipAccountActiveCheck) return true;

    const requireConfirmedEmailOnly = this.reflector.get<boolean>(
      EMAIL_CONFIRM_KEY,
      context.getHandler(),
    );
    if (requireConfirmedEmailOnly) {
      if (!payload.emailConfirmed) throw new ForbiddenError('Email is not confirmed');
      return true;
    }

    if (
      !accountActive({
        emailConfirmed: payload.emailConfirmed,
        status: payload.userStatus,
      })
    )
      throw new ForbiddenError('Account is inactive');

    return true;
  }
}
