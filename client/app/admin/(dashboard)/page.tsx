'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { ErrorAlert } from '@/components/common/error-alert';
import { SystemStats } from '@/components/admin/overview/system-stats';
import { UsersOverview } from '@/components/admin/overview/users-overview';
import { BusinessesOverview } from '@/components/admin/overview/businesses-overview';
import { ApplicantsOverview } from '@/components/admin/overview/applicants-overview';
import type { SystemStats as SystemStatsType } from '@/components/admin/overview/system-stats';
import type { AdminUserRow } from '@/components/admin/overview/users-overview';
import type { AdminBusinessRow } from '@/components/admin/overview/businesses-overview';
import type { AdminApplicantRow } from '@/components/admin/overview/applicants-overview';
import { apiClient } from '@/api/client';

interface AdminOverviewData {
  stats: SystemStatsType;
  recent_users: AdminUserRow[];
  recent_businesses: AdminBusinessRow[];
  recent_applicants: AdminApplicantRow[];
}

const LoadingSkeleton = () => (
  <div className="flex flex-1 flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-3 px-6 pb-6">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: AdminOverviewData }>(
        '/admin/overview',
      );
      setData(res.data.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load admin overview';
      setError(errorMsg);
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
        title="System Overview"
        description="Monitor all users, businesses, and applicants across the platform"
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && (
          <div className="p-6">
            <ErrorAlert message={error} onRetry={fetchData} />
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {/* System Stats */}
            <SystemStats stats={data.stats} />

            {/* Recent Activity Tables */}
            <div className="grid gap-6 lg:grid-cols-3 px-6 pb-6">
              <UsersOverview users={data.recent_users} />
              <BusinessesOverview businesses={data.recent_businesses} />
              <ApplicantsOverview applicants={data.recent_applicants} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
