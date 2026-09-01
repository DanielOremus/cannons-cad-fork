import type { UserStatus } from '@project/shared';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

type StatusBadgeProps = {
  status: UserStatus;
  className?: string;
};

function formatStatus(status: UserStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusClassName(status: UserStatus) {
  switch (status) {
    case 'APPROVED':
      return 'border-success/30 bg-success/15 text-success-foreground';
    case 'PENDING':
      return 'border-warning/35 bg-warning/15 text-warning-foreground';
    case 'SUSPENDED':
      return 'border-orange-400/35 bg-orange-500/15 text-orange-200';
    case 'REJECTED':
      return 'border-destructive/35 bg-destructive/15 text-destructive-foreground';
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(getStatusClassName(status), className)} variant="outline">
      {formatStatus(status)}
    </Badge>
  );
}
