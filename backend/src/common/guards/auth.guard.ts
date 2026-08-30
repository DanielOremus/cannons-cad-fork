import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import { Request } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error';
import { accountActive, getPermissionsFromRoles } from '@project/shared';
import { Reflector } from '@nestjs/core';
import { ACTIVE_CHECK_KEY, EMAIL_CONFIRM_KEY } from '../decorators/account.decorator';
import { TokenStoreService } from '../../shared/modules/token/token-store.service';
import { AuthCacheService } from '../../shared/modules/auth-cache/auth-cache.service';
import { PUBLIC_ROUTE_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly tokenStore: TokenStoreService,
    private readonly authCache: AuthCacheService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isRoutePublic = this.reflector.get<boolean>(PUBLIC_ROUTE_KEY, context.getHandler());
    if (isRoutePublic) return true;

    const payload = this.tokenService.tryParseBearer(request.headers.authorization);
    if (!payload) throw new UnauthorizedError();

    const [familyExists, redisUserRoles] = await Promise.all([
      this.tokenStore.familyExists(payload.familyId),
      this.authCache.getUserRoles(payload.userId),
    ]);

    if (!familyExists) throw new UnauthorizedError();

    let userRoles = !redisUserRoles ? payload.userRoles : redisUserRoles;
    let userPerms = getPermissionsFromRoles(...userRoles);

    request.user = {
      id: payload.userId,
      roles: userRoles,
      permissions: userPerms,
      familyId: payload.familyId,
    };

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
