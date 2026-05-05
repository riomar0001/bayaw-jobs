'use client';

import { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserCheck, Clock, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { AdminUser } from '@/components/admin/users/columns';
import { BanModal } from '@/components/admin/users/ban-modal';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown, Lock, Ban, ShieldCheck as ShieldCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';

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
const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED', 'BANNED'];

const roleVariant: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  COMPANY_OWNER: 'bg-blue-100 text-blue-800',
  USER: 'bg-gray-100 text-gray-800',
};

const statusVariant: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-red-100 text-red-800',
  PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
  DELETED: 'bg-red-100 text-red-600',
  BANNED: 'bg-red-200 text-red-900',
};

function LockCountdown({ lockedUntil }: { lockedUntil: string }) {
  const unlockAt = new Date(lockedUntil).getTime();
  const [remaining, setRemaining] = useState(unlockAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(unlockAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [unlockAt]);

  if (remaining <= 0) return <span className="text-xs text-muted-foreground">Unlocking...</span>;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return <span className="text-xs text-orange-700 font-medium">{mins}m {secs}s</span>;
}

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
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);

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

  useEffect(() => {
    const now = new Date();
    const hasLocked = data?.users.some((u) => u.locked_until && new Date(u.locked_until) > now);
    if (!hasLocked) return;
    const id = setInterval(() => { void fetchData(); }, 30_000);
    return () => clearInterval(id);
  }, [data]);

  const handleBan = async (userId: string, reason: string, expiresAt?: string) => {
    await apiClient.patch(`/admin/users/${userId}/ban`, { reason: reason || undefined, expires_at: expiresAt });
    toast.success('User banned successfully');
    void fetchData();
  };

  const handleUnban = async (userId: string) => {
    await apiClient.patch(`/admin/users/${userId}/unban`, {});
    toast.success('User unbanned successfully');
    void fetchData();
  };

  const buildColumns = (): ColumnDef<AdminUser>[] => [
    {
      id: 'name',
      accessorFn: (row) => `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.email,
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        const name = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || '—';
        const initials = `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || u.email[0].toUpperCase();
        return (
          <div className="flex items-center gap-3 px-4">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none text-sm">{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue<string>('role');
        return <Badge variant="secondary" className={cn('text-xs', roleVariant[role] ?? 'bg-gray-100')}>{role}</Badge>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        return (
          <Badge variant="secondary" className={cn('text-xs', statusVariant[status] ?? 'bg-gray-100')}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'email_verified',
      header: 'Verified',
      cell: ({ row }) =>
        row.getValue<boolean>('email_verified') ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Yes</Badge>
        ) : (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">No</Badge>
        ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Joined <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground px-4">{formatDate(row.getValue('created_at'))}</span>
      ),
    },
    {
      accessorKey: 'last_login_at',
      header: 'Last Login',
      cell: ({ row }) => {
        const v = row.getValue<string | null>('last_login_at');
        return <span className="text-sm text-muted-foreground">{v ? formatDate(v) : '—'}</span>;
      },
    },
    {
      accessorKey: 'locked_until',
      header: 'Lock Expires',
      cell: ({ row }) => {
        const v = row.original.locked_until;
        if (!v || new Date(v) <= new Date()) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-orange-600 shrink-0" />
            <LockCountdown lockedUntil={v} />
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const u = row.original;
        if (u.role === 'ADMIN') return null;
        if (u.status === 'BANNED') {
          return (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => void handleUnban(u.id)}
            >
              <ShieldCheckIcon className="size-3 mr-1" />
              Unban
            </Button>
          );
        }
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => { setBanTarget(u); setBanModalOpen(true); }}
          >
            <Ban className="size-3 mr-1" />
            Ban
          </Button>
        );
      },
    },
  ];

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
            <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
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
              <StatsCard title="Pending Verification" value={data.stats.pending_verification} icon={Clock} />
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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => void fetchData()} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Badge variant="outline">{data.stats.total} total</Badge>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={buildColumns()}
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

      <BanModal
        user={banTarget}
        open={banModalOpen}
        onClose={() => { setBanModalOpen(false); setBanTarget(null); }}
        onConfirm={handleBan}
      />
    </>
  );
}
