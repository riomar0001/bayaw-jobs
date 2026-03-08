import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JobStatus } from '@/api/types';

const statusStyles: Record<JobStatus, string> = {
  OPEN: 'bg-green-100 text-green-800 hover:bg-green-100',
  PAUSED: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  CLOSED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const statusLabels: Record<JobStatus, string> = {
  OPEN: 'Active',
  PAUSED: 'Paused',
  CLOSED: 'Closed',
};

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  );
}
