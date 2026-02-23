import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JobStatus } from "@/types/job";

const statusStyles: Record<JobStatus, string> = {
  Active: "bg-green-100 text-green-800 hover:bg-green-100",
  Draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  Paused: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Closed: "bg-red-100 text-red-800 hover:bg-red-100",
};

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[status], className)}>
      {status}
    </Badge>
  );
}
