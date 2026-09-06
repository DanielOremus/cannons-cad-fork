import { PermissionMeta, PermissionType } from '@project/shared';
import { ForbiddenError } from '../errors/app.error.js';

export const getScopesOrThrow = (meta: PermissionMeta) => {
  if (meta.type !== PermissionType.SCOPED) throw new ForbiddenError();
  return meta.scopes;
};
