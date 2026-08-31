import type { AdminUserRole } from '../model/adminUsers.types';
import { USER_ROLE_OPTIONS } from '../model/adminUsers.types';
import { getStaffPriority, hasHigherOrSamePriority } from '@project/shared';

const roleOrder = new Map(USER_ROLE_OPTIONS.map((role, index) => [role, index]));

export function normalizeRoles(roles: AdminUserRole[]) {
  return USER_ROLE_OPTIONS.filter((role) => roles.includes(role));
}

export function areRoleSetsEqual(first: AdminUserRole[], second: AdminUserRole[]) {
  const normalizedFirst = normalizeRoles(first);
  const normalizedSecond = normalizeRoles(second);

  return (
    normalizedFirst.length === normalizedSecond.length &&
    normalizedFirst.every((role, index) => role === normalizedSecond[index])
  );
}

export function sortRoles(roles: AdminUserRole[]) {
  return [...new Set(roles)].sort(
    (first, second) => (roleOrder.get(first) ?? 0) - (roleOrder.get(second) ?? 0),
  );
}

export function getHighestRolePriority(roles: AdminUserRole[]) {
  return Math.max(0, ...roles.map(getStaffPriority));
}

export function getAssignableRoles(currentUserRoles: AdminUserRole[]) {
  const currentUserPriority = getHighestRolePriority(currentUserRoles);

  return USER_ROLE_OPTIONS.filter(
    (role) => getStaffPriority(role) < currentUserPriority,
  );
}

export function canManageTargetRoles(
  targetRoles: AdminUserRole[],
  currentUserRoles: AdminUserRole[],
) {
  return !hasHigherOrSamePriority(
    targetRoles,
    getHighestRolePriority(currentUserRoles),
  );
}
