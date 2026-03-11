'use client';

import { useEffect, useState } from 'react';
import { Building2, Briefcase, TrendingUp, Globe } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { businessColumns, AdminBusiness } from '@/components/admin/businesses/columns';
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

interface BusinessStats {
  total: number;
  total_open_jobs: number;
  total_jobs: number;
  industries: string[];
}

interface BusinessesResponse {
  stats: BusinessStats;
  businesses: AdminBusiness[];
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
    <Skeleton className="mx-6 h-96" />
  </div>
);

export default function AdminBusinessesPage() {
  const [data, setData] = useState<BusinessesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [industryFilter, setIndustryFilter] = useState('all');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: BusinessesResponse }>(
        '/admin/businesses',
      );
      setData(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load businesses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  const filteredBusinesses = (data?.businesses ?? []).filter((b) =>
    industryFilter === 'all' || b.industry === industryFilter,
  );

  const industries = data?.stats.industries ?? [];

  const filters = (
    <Select value={industryFilter} onValueChange={setIndustryFilter}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Industry" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Industries</SelectItem>
        {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <PageHeader
        title="Businesses"
        description="View and manage all registered companies"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Businesses' }]}
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="p-6"><ErrorAlert message={error} onRetry={fetchData} /></div>}

        {!isLoading && !error && data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Businesses" value={data.stats.total} icon={Building2} />
              <StatsCard title="Open Jobs" value={data.stats.total_open_jobs} icon={TrendingUp} />
              <StatsCard title="Total Jobs Posted" value={data.stats.total_jobs} icon={Briefcase} />
              <StatsCard title="Industries" value={industries.length} icon={Globe} />
            </div>

            <div className="rounded-md border bg-card mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      All Businesses
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Overview of all registered companies and their activity.
                    </p>
                  </div>
                  <Badge variant="outline">{data.stats.total} total</Badge>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={businessColumns}
                  data={filteredBusinesses}
                  searchColumn="company"
                  searchPlaceholder="Search company name..."
                  emptyMessage="No businesses found."
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
