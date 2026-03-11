'use client';

import { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserCheck, Clock } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { userColumns, AdminUser } from '@/components/admin/users/columns';
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

interface UserStats {
  total: number;
  admins: number;
  company_owners: number;
  applicants: number;
  pending_verification: number;
}

interface UsersResponse {
  stats: UserStats;
  users: AdminUser[];
}

const ROLES = ['ADMIN', 'COMPANY_OWNER', 'USER'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED'];

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
    <Skeleton className="mx-6 h-96" />
  </div>
);

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: UsersResponse }>('/admin/users');
      setData(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchData(); }, []);

  // Client-side filter applied via TanStack table column filters
  const filteredUsers = (data?.users ?? []).filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchRole && matchStatus;
  });

  const filters = (
    <>
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage all registered users on the platform"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="p-6"><ErrorAlert message={error} onRetry={fetchData} /></div>}

        {!isLoading && !error && data && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Users" value={data.stats.total} icon={Users} />
              <StatsCard title="Admins" value={data.stats.admins} icon={ShieldCheck} />
              <StatsCard title="Company Owners" value={data.stats.company_owners} icon={UserCheck} />
              <StatsCard
                title="Pending Verification"
                value={data.stats.pending_verification}
                icon={Clock}
              />
            </div>

            <div className="rounded-md border bg-card mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">All Users</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      View and manage platform users across all roles.
                    </p>
                  </div>
                  <Badge variant="outline">{data.stats.total} total</Badge>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={userColumns}
                  data={filteredUsers}
                  searchColumn="name"
                  searchPlaceholder="Search by name or email..."
                  emptyMessage="No users found."
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
