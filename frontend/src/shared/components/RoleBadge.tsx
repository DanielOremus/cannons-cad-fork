import type { UserRole } from '@project/shared';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

type RoleBadgeProps = {
  role: UserRole;
  className?: string;
};

function formatRole(role: UserRole) {
  return role
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isStaffRole(role: UserRole) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      className={cn(
        isStaffRole(role)
          ? 'border-primary/35 bg-primary/10 text-primary'
          : 'border-border-strong/60 bg-secondary text-secondary-foreground',
        className,
      )}
      variant="outline"
    >
      {formatRole(role)}
    </Badge>
  );
}
