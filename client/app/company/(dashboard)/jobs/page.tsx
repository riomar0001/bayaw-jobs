'use client';

import Link from 'next/link';
import { Plus, Briefcase, Users, XCircle, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { DataTable } from '@/components/company/dashboard/jobs/data-table';
import { columns } from '@/components/company/dashboard/jobs/columns';
import { ErrorAlert } from '@/components/common/error-alert';
import { businessService } from '@/api/services/business.service';
import { jobsService } from '@/api/services/jobs.service';
import { useEffect, useState } from 'react';
import { CompanyJob, JobStats } from '@/api/types';
import { Skeleton } from '@/components/ui/skeleton';

const StatsLoadingSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

export default function JobsPage() {
  const [data, setData] = useState<JobStats | null>(null);
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsResult, jobsResult] = await Promise.all([
        businessService.getJobStats(),
        jobsService.getCompanyJobs(),
      ]);

      setData(statsResult);
      setJobs(jobsResult.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMsg);
      console.error('[JobsPage]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Manage your job postings"
        breadcrumbs={[{ label: 'Dashboard', href: '/company' }, { label: 'Jobs' }]}
      />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <StatsLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchData} />}
        {!isLoading && !error && (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Jobs" value={data?.total_jobs ?? 0} icon={Briefcase} />
              <StatsCard title="Active Jobs" value={data?.active_jobs ?? 0} icon={TrendingUp} />
              <StatsCard
                title="Total Applicants"
                value={data?.total_applicants ?? 0}
                icon={Users}
              />
              <StatsCard title="Closed Jobs" value={data?.closed_jobs ?? 0} icon={XCircle} />
            </div>

            {/* Jobs Table */}
            <div className="rounded-md border bg-card text-card-foreground shadow-sm mx-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 p-6">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">All Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your job postings and applicants.
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href="/company/jobs/new">
                    <Plus className="mr-2 size-4" />
                    Post New Job
                  </Link>
                </Button>
              </div>
              <div className="p-6 pt-0">
                <DataTable columns={columns} data={jobs} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
