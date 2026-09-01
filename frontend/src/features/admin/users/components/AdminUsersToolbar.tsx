import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type {
  AdminSortOrder,
  AdminStatusFilter,
  AdminUserSortOption,
} from '../model/adminUsers.types';
import {
  SORT_ORDER_OPTIONS,
  USER_SORT_OPTIONS,
  USER_STATUS_OPTIONS,
} from '../model/adminUsers.types';
import { formatUserValue } from '../utils/formatUserLabels';

type AdminUsersToolbarProps = {
  statusFilter: AdminStatusFilter;
  sortBy: AdminUserSortOption;
  sortOrder: AdminSortOrder;
  disabled?: boolean;
  onStatusFilterChange: (status: AdminStatusFilter) => void;
  onSortByChange: (sortBy: AdminUserSortOption) => void;
  onSortOrderChange: (sortOrder: AdminSortOrder) => void;
  onReset: () => void;
};

const sortLabels: Record<AdminUserSortOption, string> = {
  name: 'Name',
  status: 'Status',
  createdAt: 'Created at',
};

const sortOrderLabels: Record<AdminSortOrder, string> = {
  asc: 'Ascending',
  desc: 'Descending',
};

export function AdminUsersToolbar({
  statusFilter,
  sortBy,
  sortOrder,
  disabled,
  onStatusFilterChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: AdminUsersToolbarProps) {
  const hasCustomQuery = statusFilter !== 'all' || sortBy !== 'createdAt' || sortOrder !== 'desc';

  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-medium text-foreground">
            Status
            <Select<AdminStatusFilter>
              value={statusFilter}
              disabled={disabled}
              onValueChange={(nextValue) => {
                if (nextValue) {
                  onStatusFilterChange(nextValue);
                }
              }}
            >
              <SelectTrigger className="w-40 border-input bg-input hover:border-border-strong hover:bg-surface-hover focus-visible:border-primary focus-visible:ring-ring/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="border border-border bg-popover">
                <SelectItem value="all" className="focus:bg-primary/15">
                  All statuses
                </SelectItem>
                {USER_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status} className="focus:bg-primary/15">
                    {formatUserValue(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-foreground">
            Sort by
            <Select<AdminUserSortOption>
              value={sortBy}
              disabled={disabled}
              onValueChange={(nextValue) => {
                if (nextValue) {
                  onSortByChange(nextValue);
                }
              }}
            >
              <SelectTrigger className="w-40 border-input bg-input hover:border-border-strong hover:bg-surface-hover focus-visible:border-primary focus-visible:ring-ring/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="border border-border bg-popover">
                {USER_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className="focus:bg-primary/15">
                    {sortLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-foreground">
            Order
            <Select<AdminSortOrder>
              value={sortOrder}
              disabled={disabled}
              onValueChange={(nextValue) => {
                if (nextValue) {
                  onSortOrderChange(nextValue);
                }
              }}
            >
              <SelectTrigger className="w-40 border-input bg-input hover:border-border-strong hover:bg-surface-hover focus-visible:border-primary focus-visible:ring-ring/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="border border-border bg-popover">
                {SORT_ORDER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className="focus:bg-primary/15">
                    {sortOrderLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled || !hasCustomQuery}
          onClick={onReset}
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
}
