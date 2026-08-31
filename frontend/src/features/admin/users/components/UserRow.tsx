import { Fragment, useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  TableCell,
  TableRow,
} from '@/shared/components/ui/table';
import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  AdminUserUpdate,
} from '../model/adminUsers.types';
import { formatDate } from '../utils/formatDate';
import {
  areRoleSetsEqual,
  canManageTargetRoles,
  getAssignableRoles,
  sortRoles,
} from '../utils/roles';
import { UserStatusSelect } from './UserStatusSelect';
import { UserRolesMultiSelect } from './UserRolesMultiSelect';
import { getAdminUsersErrorMessage } from '../utils/adminUsersErrors';

type UserRowProps = {
  user: AdminUser;
  currentUserRoles: AdminUserRole[];
  onSave: (userId: string, update: AdminUserUpdate) => Promise<void>;
};

export function UserRow({ user, currentUserRoles, onSave }: UserRowProps) {
  const [draftStatus, setDraftStatus] = useState<AdminUserStatus>(user.status);
  const [draftRoles, setDraftRoles] = useState<AdminUserRole[]>(() => sortRoles(user.roles));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const canEditTarget = useMemo(
    () => canManageTargetRoles(user.roles, currentUserRoles),
    [currentUserRoles, user.roles],
  );
  const assignableRoles = useMemo(
    () => getAssignableRoles(currentUserRoles),
    [currentUserRoles],
  );
  const rolesChanged = useMemo(
    () => !areRoleSetsEqual(draftRoles, user.roles),
    [draftRoles, user.roles],
  );
  const statusChanged = draftStatus !== user.status;
  const isDirty = statusChanged || rolesChanged;
  const controlsDisabled = isSaving || !canEditTarget;

  async function handleSave() {
    if (!isDirty || controlsDisabled) {
      return;
    }

    const update: AdminUserUpdate = {};

    if (statusChanged) {
      update.status = draftStatus;
    }

    if (rolesChanged) {
      update.roles = sortRoles(draftRoles);
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(user.id, update);
    } catch (saveError) {
      setError(getAdminUsersErrorMessage(saveError, 'Could not update this user.'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <div className="font-medium">{user.name}</div>
          {/* <div className="text-xs text-muted-foreground">{user.id}</div> */}
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <UserStatusSelect
              value={draftStatus}
              disabled={controlsDisabled}
              onChange={setDraftStatus}
            />
            {/* <StatusBadge className="w-fit" status={draftStatus} /> */}
          </div>
        </TableCell>
        <TableCell>
          <UserRolesMultiSelect
            roles={draftRoles}
            assignableRoles={assignableRoles}
            disabled={controlsDisabled}
            onChange={setDraftRoles}
          />
        </TableCell>
        <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
        <TableCell className="text-right">
          <Button
            type="button"
            variant={isDirty ? 'default' : 'secondary'}
            disabled={!isDirty || controlsDisabled}
            onClick={() => {
              void handleSave();
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {!canEditTarget && (
            <p className="mt-1 text-xs text-muted-foreground">
              Protected role level
            </p>
          )}
        </TableCell>
      </TableRow>
      {error && (
        <TableRow>
          <TableCell colSpan={5}>
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
