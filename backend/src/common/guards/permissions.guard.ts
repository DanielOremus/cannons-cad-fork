import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  findPermissionsByPrefix,
  hasPermissionFromSet,
  Permission,
  PermissionBase,
  PermissionMeta,
  PermissionsMap,
  PermissionType,
} from '@project/shared';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator.js';
import { Request } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<PermissionBase>(PERMISSION_KEY, context.getHandler());

    if (!required) throw new Error('Permission metadata is missing');

    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) throw new UnauthorizedError();
    const userPermissions = request.user.permissions;

    const permMeta = (PermissionsMap[required.resource] as any)[required.action] as PermissionMeta;

    switch (permMeta.type) {
      case PermissionType.SCOPED: {
        const prefix = `${required.resource}:${required.action}:`;
        const { permissionArgs: scopes } = findPermissionsByPrefix(
          userPermissions,
          prefix,
          permMeta.scopes,
        );
        if (scopes.length === 0) throw new ForbiddenError();
        request.permissionMeta = {
          type: PermissionType.SCOPED,
          scopes,
        };
        break;
      }
      case PermissionType.CONTEXTUAL: {
        const prefix = `${required.resource}:${required.action}:`;
        const { permissionArgs: contexts } = findPermissionsByPrefix(
          userPermissions,
          prefix,
          permMeta.contexts,
        );
        if (contexts.length === 0) throw new ForbiddenError();
        request.permissionMeta = {
          type: PermissionType.CONTEXTUAL,
          contexts,
        };
        break;
      }
      default:
        const perm = `${required.resource}:${required.action}` as Permission;
        if (!hasPermissionFromSet(userPermissions, perm)) throw new ForbiddenError();
        request.permissionMeta = {
          type: PermissionType.GLOBAL,
        };
        break;
    }

    return true;
  }
}
