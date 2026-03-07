'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  PauseCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobStatusBadge } from '@/components/company/dashboard/jobs/job-status-badge';
import { JobForm } from '@/components/company/dashboard/jobs/forms/job-form';
import { jobsService } from '@/api/services/jobs.service';
import { formatSalaryRange } from '@/lib/formatters';
import { Job, JobStatus } from '@/api/types';
import { toast } from 'sonner';

const STATUS_ACTIONS: Record<
  JobStatus,
  { label: string; icon: React.ElementType; className?: string }
> = {
  OPEN: { label: 'Publish', icon: CheckCircle2, className: 'text-green-600' },
  PAUSED: {
    label: 'Pause',
    icon: PauseCircle,
    className: 'text-yellow-600',
  },
  CLOSED: { label: 'Close Job', icon: XCircle, className: 'text-destructive' },
};

const ALL_STATUSES: JobStatus[] = ['OPEN', 'PAUSED', 'CLOSED'];

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<JobStatus>('OPEN');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await jobsService.getCompanyJob(id);
        setJob(data);
        setCurrentStatus(data.status);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load job';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleStatusChange = async (status: JobStatus) => {
    if (!job) return;
    setIsUpdatingStatus(true);
    try {
      await jobsService.updateJobStatus(job.id, status);
      setCurrentStatus(status);
      setJob({ ...job, status }); // Update the job object so the form gets the new status
      toast.success(`Job status updated to ${status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Edit Job"
          breadcrumbs={[
            { label: 'Dashboard', href: '/company/' },
            { label: 'Jobs', href: '/company/jobs' },
            { label: 'Loading...' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <PageHeader
          title="Edit Job"
          breadcrumbs={[
            { label: 'Dashboard', href: '/company/' },
            { label: 'Jobs', href: '/company/jobs' },
            { label: 'Error' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">{error || 'Job not found'}</p>
        </div>
      </>
    );
  }

  const otherStatuses = ALL_STATUSES.filter((s) => s !== currentStatus);

  return (
    <>
      <PageHeader
        title="Edit Job"
        breadcrumbs={[
          { label: 'Dashboard', href: '/company/' },
          { label: 'Jobs', href: '/company/jobs' },
          { label: job.title, href: `/company/jobs/${id}` },
          { label: 'Edit' },
        ]}
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Job Header Card */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <JobStatusBadge status={currentStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {job.location} · {job.location_type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {job.employment_type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5" />
                    {formatSalaryRange(
                      Number(job.minimum_salary),
                      Number(job.maximum_salary),
                      job.currency,
                    )}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isUpdatingStatus}>
                    {isUpdatingStatus ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
                    Update Status
                    <ChevronDown className="ml-1 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {otherStatuses.map((status) => {
                    const { label, icon: Icon, className } = STATUS_ACTIONS[status];
                    return (
                      <DropdownMenuItem
                        key={status}
                        className={className}
                        onClick={() => handleStatusChange(status)}
                      >
                        <Icon className="mr-2 size-4" />
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <JobForm job={job} mode="edit" key={job.id} />
      </div>
    </>
  );
}
