'use client';

import { useEffect, useState } from 'react';
import { UserCheck, Briefcase, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { applicantColumns, AdminApplicant } from '@/components/admin/applicants/columns';
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

interface ApplicantStats {
  total: number;
  actively_looking: number;
  total_applications: number;
  avg_applications_per_applicant: number;
}

interface ApplicantsResponse {
  stats: ApplicantStats;
  applicants: AdminApplicant[];
}

const CAREER_STATUSES = [
  { value: 'ACTIVELY_LOOKING', label: 'Actively Looking' },
  { value: 'OPEN_TO_OPPORTUNITIES', label: 'Open to Opportunities' },
  { value: 'EMPLOYED_NOT_LOOKING', label: 'Employed' },
  { value: 'NOT_LOOKING', label: 'Not Looking' },
];

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
    <Skeleton className="mx-6 h-96" />
  </div>
);

export default function AdminApplicantsPage() {
  const [data, setData] = useState<ApplicantsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerStatusFilter, setCareerStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: ApplicantsResponse }>(
        '/admin/applicants',
      );
      setData(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  const filteredApplicants = (data?.applicants ?? []).filter((a) =>
    careerStatusFilter === 'all' || a.career_status === careerStatusFilter,
  );

  const filters = (
    <Select value={careerStatusFilter} onValueChange={setCareerStatusFilter}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Career Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        {CAREER_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <PageHeader
        title="Applicants"
        description="View and manage all registered job seekers"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Applicants' }]}
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="p-6"><ErrorAlert message={error} onRetry={fetchData} /></div>}

        {!isLoading && !error && data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Applicants" value={data.stats.total} icon={Users} />
              <StatsCard
                title="Actively Looking"
                value={data.stats.actively_looking}
                icon={TrendingUp}
              />
              <StatsCard
                title="Total Applications"
                value={data.stats.total_applications}
                icon={Briefcase}
              />
              <StatsCard
                title="Avg Applications"
                value={data.stats.avg_applications_per_applicant}
                description="Per applicant"
                icon={UserCheck}
              />
            </div>

            <div className="rounded-md border bg-card mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      All Applicants
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse all registered job seekers and their activity.
                    </p>
                  </div>
                  <Badge variant="outline">{data.stats.total} total</Badge>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={applicantColumns}
                  data={filteredApplicants}
                  searchColumn="name"
                  searchPlaceholder="Search applicant name..."
                  emptyMessage="No applicants found."
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
