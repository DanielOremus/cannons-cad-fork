import { SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionResource } from '@project/shared';

export const PERMISSION_KEY = 'permission';

export function RequirePermission<R extends PermissionResource>(
  resource: R,
  action: PermissionAction<R>,
) {
  return SetMetadata(PERMISSION_KEY, { resource, action });
}
