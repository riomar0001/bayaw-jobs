'use client';

import { Briefcase, Users, UserCheck, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { RecentApplicantsList } from '@/components/company/dashboard/dashboard/recent-applicants-list';
import { RecentJobsList } from '@/components/company/dashboard/dashboard/recent-jobs-list';
import { AnalyticsChart } from '@/components/company/dashboard/dashboard/analytics-chart';
import { ApplicationPipeline } from '@/components/company/dashboard/dashboard/application-pipeline';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardData, JobStats } from '@/api/types';
import { useEffect, useState } from 'react';
import { businessService } from '@/api/services/business.service';

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

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [jobStats, setJobStats] = useState<JobStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboard = await businessService.getDashboard();
      const job = await businessService.getJobStats();

      setDashboardData(dashboard);
      setJobStats(job);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMsg);
      console.error('[useDashboardData]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your recruitment activities" />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <StatsLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchData} />}
        {!isLoading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard
                title="Total Jobs"
                value={jobStats?.total_jobs ?? 0}
                description={`${jobStats?.active_jobs ?? 0} active jobs`}
                icon={Briefcase}
              />
              <StatsCard
                title="Total Applicants"
                value={dashboardData?.summary.total_applicants ?? 0}
                description="Across all job postings"
                icon={Users}
              />
              <StatsCard
                title="New This Week"
                value={dashboardData?.summary.new_applicants_this_week ?? 0}
                description="New applications received"
                icon={TrendingUp}
              />
              <StatsCard
                title="Interviews Scheduled"
                value={dashboardData?.summary.interviewed_applicants ?? 0}
                description={`${dashboardData?.summary.interviewed_applicants ?? 0} offers extended`}
                icon={UserCheck}
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2 px-6">
              <AnalyticsChart data={dashboardData?.applicant_trends} />
              <ApplicationPipeline data={dashboardData?.application_pipeline} />
            </div>

            {/* Recent Lists Row */}
            <div className="grid gap-6 lg:grid-cols-2 px-6 pb-6">
              <RecentApplicantsList applicants={dashboardData?.recent_applicants} />
              <RecentJobsList jobs={dashboardData?.recent_jobs} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
