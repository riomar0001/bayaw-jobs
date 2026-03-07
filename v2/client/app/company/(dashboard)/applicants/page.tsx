'use client';

import { Users, UserCheck, Clock, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { DataTable } from '@/components/company/dashboard/applicants/data-table';
import { getColumns } from '@/components/company/dashboard/applicants/columns';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { ApplicantStats, ApplicationStatus, CompanyJobApplicant } from '@/api/types';
import { businessService } from '@/api/services/business.service';
import { jobsService } from '@/api/services/jobs.service';
import { toast } from 'sonner';

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

export default function ApplicantsPage() {
  const [stats, setStats] = useState<ApplicantStats | null>(null);
  const [applicants, setApplicants] = useState<CompanyJobApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsResult, applicantsResult] = await Promise.all([
        businessService.getApplicantStats(),
        jobsService.getCompanyApplicants(),
      ]);
      setStats(statsResult);
      setApplicants(applicantsResult.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load applicant data';
      setError(errorMsg);
      console.error('[ApplicantsPage]', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = useCallback(
    async (applicationId: string, status: ApplicationStatus) => {
      try {
        await businessService.updateApplicationStatus(applicationId, status);
        setApplicants((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, status } : app)),
        );
        toast.success(`Application status updated to ${status}`);
        // Refresh stats
        const statsResult = await businessService.getApplicantStats();
        setStats(statsResult);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update status';
        toast.error(message);
      }
    },
    [],
  );

  const columns = useMemo(
    () => getColumns({ onStatusUpdate: handleStatusUpdate }),
    [handleStatusUpdate],
  );

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Applicants"
        description="Manage all applicants across job postings"
        breadcrumbs={[{ label: 'Dashboard', href: '/company/' }, { label: 'Applicants' }]}
      />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <StatsLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchData} />}
        {!isLoading && !error && stats && (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Applicants" value={stats.total_applicants} icon={Users} />
              <StatsCard title="In Interview" value={stats.in_interview} icon={Clock} />
              <StatsCard title="Hired" value={stats.hired} icon={UserCheck} />
              <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
            </div>

            {/* Applicants Data Table */}
            <div className="rounded-md border bg-card text-card-foreground shadow-sm mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                  All Applicants
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review and manage candidates across all job postings.
                </p>
              </div>
              <div className="p-6 pt-0">
                <DataTable columns={columns} data={applicants} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
