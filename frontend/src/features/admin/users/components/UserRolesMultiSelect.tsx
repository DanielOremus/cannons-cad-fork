import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { RoleBadge } from '@/shared/components/RoleBadge';
import type { AdminUserRole } from '../model/adminUsers.types';
import { formatUserValue } from '../utils/formatUserLabels';
import { sortRoles } from '../utils/roles';

type UserRolesMultiSelectProps = {
  roles: AdminUserRole[];
  assignableRoles: AdminUserRole[];
  disabled?: boolean;
  onChange: (roles: AdminUserRole[]) => void;
};

export function UserRolesMultiSelect({
  roles,
  assignableRoles,
  disabled,
  onChange,
}: UserRolesMultiSelectProps) {
  const sortedRoles = sortRoles(roles);
  const sortedAssignableRoles = sortRoles(assignableRoles);

  function toggleRole(role: AdminUserRole, checked: boolean) {
    const nextRoles = checked
      ? sortRoles([...roles, role])
      : sortRoles(roles.filter((item) => item !== role));

    onChange(nextRoles);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label="User roles"
        className="inline-flex min-h-8 w-64 items-center justify-between gap-2 rounded-lg border border-input bg-input px-2.5 py-1.5 text-left text-sm outline-none transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex min-w-0 flex-wrap gap-1">
          {sortedRoles.length > 0 ? (
            sortedRoles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))
          ) : (
            <span className="text-muted-foreground">Select roles</span>
          )}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 border border-border bg-popover">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Roles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortedAssignableRoles.length > 0 ? (
            sortedAssignableRoles.map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={roles.includes(role)}
                closeOnClick={false}
                disabled={disabled}
                className="focus:bg-primary/15 focus:text-foreground"
                onCheckedChange={(checked) => toggleRole(role, checked)}
              >
                {formatUserValue(role)}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No roles available to assign.
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
