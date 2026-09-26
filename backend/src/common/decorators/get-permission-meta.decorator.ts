import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AppSocket } from '../../shared/types/socket.js';

export const GetPermissionMeta = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'ws') return ctx.switchToWs().getClient<AppSocket>().data.permissionMeta;
  return ctx.switchToHttp().getRequest<Request>().permissionMeta;
});
