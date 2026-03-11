'use client';

import { useEffect, useState } from 'react';
import { Briefcase, TrendingUp, XCircle, FileText } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { jobColumns, AdminJob } from '@/components/admin/jobs/columns';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/api/client';
import type { JobStatus, EmploymentType } from '@/api/types';

interface JobStats {
  total: number;
  open: number;
  closed: number;
  draft: number;
  paused: number;
  total_applications: number;
}

interface JobsResponse {
  stats: JobStats;
  jobs: AdminJob[];
}

const JOB_STATUSES: JobStatus[] = ['OPEN', 'CLOSED', 'PAUSED', 'DRAFT'];
const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'INTERN', label: 'Intern' },
];

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
    <Skeleton className="mx-6 h-96" />
  </div>
);

export default function AdminJobsPage() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: JobsResponse }>('/admin/jobs');
      setData(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  const filteredJobs = (data?.jobs ?? []).filter((j) => {
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchType = typeFilter === 'all' || j.employment_type === typeFilter;
    return matchStatus && matchType;
  });

  const filters = (
    <>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {JOB_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {EMPLOYMENT_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Monitor all job postings across every company"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Jobs' }]}
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="p-6"><ErrorAlert message={error} onRetry={fetchData} /></div>}

        {!isLoading && !error && data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Jobs" value={data.stats.total} icon={Briefcase} />
              <StatsCard title="Open" value={data.stats.open} icon={TrendingUp} />
              <StatsCard title="Closed" value={data.stats.closed} icon={XCircle} />
              <StatsCard
                title="Total Applications"
                value={data.stats.total_applications}
                icon={FileText}
              />
            </div>

            <div className="rounded-md border bg-card mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">All Jobs</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      All job postings across all companies on the platform.
                    </p>
                  </div>
                  <Badge variant="outline">{data.stats.total} total</Badge>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={jobColumns}
                  data={filteredJobs}
                  searchColumn="job"
                  searchPlaceholder="Search job title..."
                  emptyMessage="No jobs found."
                  filters={filters}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
