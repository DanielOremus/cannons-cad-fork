import { PermissionResource } from './permission.resource.js';
import { PermissionAction } from './permission.action.js';

export type Permission = `${PermissionResource}:${PermissionAction}`;
