import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  type AdminUserStatus,
  USER_STATUS_OPTIONS,
} from '../model/adminUsers.types';
import { formatUserValue } from '../utils/formatUserLabels';

type UserStatusSelectProps = {
  value: AdminUserStatus;
  disabled?: boolean;
  onChange: (status: AdminUserStatus) => void;
};

export function UserStatusSelect({ value, disabled, onChange }: UserStatusSelectProps) {
  return (
    <Select<AdminUserStatus>
      value={value}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
    >
      <SelectTrigger
        className="w-36 border-input bg-input hover:border-border-strong hover:bg-surface-hover focus-visible:border-primary focus-visible:ring-ring/30"
        aria-label="Account status"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" className="border border-border bg-popover">
        {USER_STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status} className="focus:bg-primary/15">
            {formatUserValue(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
