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
import { AppSocket } from '../../shared/types/socket.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private checkPermission(
    userPermissions: Set<Permission>,
    required: PermissionBase,
  ): PermissionMeta {
    // eslint-disable-next-line
    const permMeta = (PermissionsMap[required.resource] as any)[required.action] as PermissionMeta;

    console.log(permMeta);

    switch (permMeta.type) {
      case PermissionType.SCOPED: {
        const prefix = `${required.resource}:${required.action}:`;
        const { permissionArgs: scopes } = findPermissionsByPrefix(
          userPermissions,
          prefix,
          permMeta.scopes,
        );
        if (scopes.length === 0) throw new ForbiddenError();
        return {
          type: PermissionType.SCOPED,
          scopes,
        };
      }
      case PermissionType.CONTEXTUAL: {
        const prefix = `${required.resource}:${required.action}:`;
        const { permissionArgs: contexts } = findPermissionsByPrefix(
          userPermissions,
          prefix,
          permMeta.contexts,
        );
        if (contexts.length === 0) throw new ForbiddenError();
        return {
          type: PermissionType.CONTEXTUAL,
          contexts,
        };
      }
      case PermissionType.GLOBAL:
      default: {
        const perm = `${required.resource}:${required.action}` as Permission;
        if (!hasPermissionFromSet(userPermissions, perm)) throw new ForbiddenError();
        return {
          type: PermissionType.GLOBAL,
        };
      }
    }
  }

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<PermissionBase>(PERMISSION_KEY, context.getHandler());

    if (!required) return true;

    if (context.getType() === 'ws') {
      const socket = context.switchToWs().getClient<AppSocket>();
      if (!socket.data.user) throw new UnauthorizedError();
      socket.data.permissionMeta = this.checkPermission(socket.data.user.permissions, required);
    } else {
      const request = context.switchToHttp().getRequest<Request>();
      if (!request.user) throw new UnauthorizedError();
      request.permissionMeta = this.checkPermission(request.user.permissions, required);
    }

    return true;
  }
}
