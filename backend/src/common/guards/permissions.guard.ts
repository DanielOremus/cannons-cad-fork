import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermissionFromSet, RequiredPermission, ResourceAction } from '@project/shared';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator.js';
import { Request } from 'express';
import { ForbiddenError } from '../../shared/errors/app.error.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<RequiredPermission>(PERMISSION_KEY, context.getHandler());

    if (!required) return true;

    const { resource, action } = required;

    const request = context.switchToHttp().getRequest<Request>();

    const userPermissions = request.user!.permissions;

    const hasAny = hasPermissionFromSet(
      userPermissions,
      resource,
      action as ResourceAction<typeof resource>,
      'any',
    );

    if (hasAny) {
      request.permissionScope = 'any';
      return true;
    }

    const hasOwn = hasPermissionFromSet(
      userPermissions,
      resource,
      action as ResourceAction<typeof resource>,
      'own',
    );

    if (hasOwn) {
      request.permissionScope = 'own';
      return true;
    }

    throw new ForbiddenError();
  }
}
