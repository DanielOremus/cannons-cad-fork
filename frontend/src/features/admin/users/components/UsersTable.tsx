import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import type {
  AdminUser,
  AdminUserRole,
  AdminUserUpdate,
} from '../model/adminUsers.types';
import { UserRow } from './UserRow';
import { sortRoles } from '../utils/roles';

type UsersTableProps = {
  users: AdminUser[];
  currentUserRoles: AdminUserRole[];
  onSaveUser: (userId: string, update: AdminUserUpdate) => Promise<void>;
};

export function UsersTable({
  users,
  currentUserRoles,
  onSaveUser,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">No users found.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          New registered accounts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-48">Name</TableHead>
            <TableHead className="min-w-40">Status</TableHead>
            <TableHead className="min-w-72">Roles</TableHead>
            <TableHead className="min-w-32">Created at</TableHead>
            <TableHead className="min-w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={`${user.id}:${user.status}:${sortRoles(user.roles).join('|')}`}
              user={user}
              currentUserRoles={currentUserRoles}
              onSave={onSaveUser}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
