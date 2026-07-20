import { SetMetadata } from '@nestjs/common';
import { PermissionResource, ResourceAction } from '@project/shared';

export const PERMISSION_KEY = 'permission';

export function RequirePermission<T extends PermissionResource>(
  resource: T,
  action: ResourceAction<T>,
) {
  return SetMetadata(PERMISSION_KEY, { action, resource });
}
