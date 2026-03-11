'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobDetailSheet, JobRow } from './job-detail-sheet';

const stateColor: Record<string, string> = {
  waiting: 'bg-blue-100 text-blue-800',
  active: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  delayed: 'bg-purple-100 text-purple-800',
  paused: 'bg-gray-100 text-gray-700',
};

function formatTs(ts: number | null) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

interface JobsTableProps {
  jobs: JobRow[];
  showRetry?: boolean;
  onRetry?: (jobId: string) => void;
  onRemove?: (jobId: string) => void;
  emptyMessage?: string;
}

export function JobsTable({
  jobs,
  showRetry = false,
  onRetry,
  onRemove,
  emptyMessage = 'No jobs found.',
}: JobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Finished</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell
                      className="font-mono text-xs text-muted-foreground max-w-[120px] truncate"
                      onClick={() => setSelectedJob(job)}
                    >
                      {job.id}
                    </TableCell>
                    <TableCell
                      className="font-medium text-sm"
                      onClick={() => setSelectedJob(job)}
                    >
                      {job.name}
                    </TableCell>
                    <TableCell onClick={() => setSelectedJob(job)}>
                      <Badge
                        variant="secondary"
                        className={cn('text-xs', stateColor[job.state] ?? 'bg-gray-100')}
                      >
                        {job.state}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground"
                      onClick={() => setSelectedJob(job)}
                    >
                      {job.attemptsMade}/{job.maxAttempts}
                    </TableCell>
                    <TableCell
                      className="text-xs text-muted-foreground"
                      onClick={() => setSelectedJob(job)}
                    >
                      {formatTs(job.timestamp)}
                    </TableCell>
                    <TableCell
                      className="text-xs text-muted-foreground"
                      onClick={() => setSelectedJob(job)}
                    >
                      {formatTs(job.finishedOn)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedJob(job)}>
                            <Eye className="mr-2 size-4" />
                            View Details
                          </DropdownMenuItem>
                          {showRetry && onRetry && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onRetry(job.id)}>
                                <RotateCcw className="mr-2 size-4" />
                                Retry Job
                              </DropdownMenuItem>
                            </>
                          )}
                          {onRemove && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onRemove(job.id)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Remove
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <JobDetailSheet
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
}
