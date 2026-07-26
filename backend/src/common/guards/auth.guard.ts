import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../../shared/modules/token/token.service';
import { Request } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error';
import { RedisService } from '../../core/redis/redis.service';
import { accountActive, getPermissionsFromRoles } from '@project/shared';
import { Reflector } from '@nestjs/core';
import { ACTIVE_CHECK_KEY, EMAIL_CONFIRM_KEY } from '../decorators/account.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const payload = this.tokenService.tryParseBearer(request.headers.authorization);
    if (!payload) throw new UnauthorizedError();

    const familyExists = await this.redisService.familyExists(payload.familyId);
    if (!familyExists) throw new UnauthorizedError();

    let userPerms = new Set(await this.redisService.getUserPermissions(payload.userId));

    if (userPerms.size === 0) userPerms = getPermissionsFromRoles(...payload.userRoles);

    request.user = {
      id: payload.userId,
      permissions: userPerms,
      familyId: payload.familyId,
    };

    const skipAccountActiveCheck = this.reflector.get(ACTIVE_CHECK_KEY, context.getHandler());
    if (skipAccountActiveCheck) return true;

    const requireConfirmedEmailOnly = this.reflector.get(EMAIL_CONFIRM_KEY, context.getHandler());
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
