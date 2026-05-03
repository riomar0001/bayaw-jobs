'use client';

import { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, ShieldX, AlertTriangle, Activity, ShieldCheck, KeyRound, LogOut, UserCheck, Settings, Lock, Unlock } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { StatsCard } from '@/components/company/dashboard/dashboard/stats-card';
import { AdminDataTable } from '@/components/admin/shared/admin-data-table';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ColumnDef } from '@tanstack/react-table';
import { apiClient } from '@/api/client';

type EventType =
  | 'LOGIN_FAILED' | 'ACCOUNT_LOCKED' | 'ACCOUNT_UNLOCKED'
  | 'RATE_LIMITED' | 'LOGIN_SUCCESS' | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET_REQUESTED' | 'EMAIL_VERIFIED' | 'SUSPICIOUS_ACTIVITY'
  | 'OTP_FAILED' | 'SESSION_REVOKED' | 'ADMIN_ACTION';

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface SecurityEvent {
  id: string;
  type: EventType;
  severity: Severity;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user: { id: string; first_name: string | null; last_name: string | null; email: string } | null;
}

interface SecurityStats {
  total: number;
  last24h: number;
  by_type: Partial<Record<EventType, number>>;
  by_severity: Partial<Record<Severity, number>>;
}

interface SecurityEventsResponse {
  events: SecurityEvent[];
  total: number;
  page: number;
  limit: number;
}

const SEVERITY_BADGE: Record<Severity, string> = {
  LOW:      'bg-green-100 text-green-800',
  MEDIUM:   'bg-yellow-100 text-yellow-800',
  HIGH:     'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const SEVERITY_CARD: Record<Severity, string> = {
  LOW:      'border-green-200 bg-green-50',
  MEDIUM:   'border-yellow-200 bg-yellow-50',
  HIGH:     'border-orange-200 bg-orange-50',
  CRITICAL: 'border-red-200 bg-red-50',
};

const SEVERITY_TEXT: Record<Severity, string> = {
  LOW:      'text-green-700 dark:text-green-400',
  MEDIUM:   'text-yellow-700 dark:text-yellow-400',
  HIGH:     'text-orange-700 dark:text-orange-400',
  CRITICAL: 'text-red-700 dark:text-red-400',
};

const TYPE_LABELS: Record<EventType, string> = {
  LOGIN_FAILED:             'Login Failed',
  ACCOUNT_LOCKED:           'Account Locked',
  ACCOUNT_UNLOCKED:         'Account Unlocked',
  RATE_LIMITED:             'Rate Limited',
  LOGIN_SUCCESS:            'Login Success',
  PASSWORD_CHANGED:         'Password Changed',
  PASSWORD_RESET_REQUESTED: 'Password Reset Requested',
  EMAIL_VERIFIED:           'Email Verified',
  SUSPICIOUS_ACTIVITY:      'Suspicious Activity',
  OTP_FAILED:               'OTP Failed',
  SESSION_REVOKED:          'Session Revoked',
  ADMIN_ACTION:             'Admin Action',
};

const TYPE_ICON: Record<EventType, React.ElementType> = {
  LOGIN_FAILED:             ShieldX,
  ACCOUNT_LOCKED:           Lock,
  ACCOUNT_UNLOCKED:         Unlock,
  RATE_LIMITED:             AlertTriangle,
  LOGIN_SUCCESS:            ShieldCheck,
  PASSWORD_CHANGED:         KeyRound,
  PASSWORD_RESET_REQUESTED: KeyRound,
  EMAIL_VERIFIED:           UserCheck,
  SUSPICIOUS_ACTIVITY:      ShieldAlert,
  OTP_FAILED:               ShieldX,
  SESSION_REVOKED:          LogOut,
  ADMIN_ACTION:             Settings,
};

const TYPE_DESCRIPTION: Record<EventType, string> = {
  LOGIN_FAILED:             'A login attempt failed due to wrong password or unknown email.',
  ACCOUNT_LOCKED:           'Account was temporarily locked after too many failed login attempts.',
  ACCOUNT_UNLOCKED:         'Account lock expired and user successfully logged in.',
  RATE_LIMITED:             'Request was rejected because the rate limit was exceeded.',
  LOGIN_SUCCESS:            'User successfully completed login including OTP verification.',
  PASSWORD_CHANGED:         'Account password was changed.',
  PASSWORD_RESET_REQUESTED: 'A password reset email was requested for this account.',
  EMAIL_VERIFIED:           'User verified their email address.',
  SUSPICIOUS_ACTIVITY:      'Login succeeded after multiple prior failures — possible brute-force attempt.',
  OTP_FAILED:               'An invalid or expired OTP code was submitted during login.',
  SESSION_REVOKED:          'One or more active sessions were revoked (logout).',
  ADMIN_ACTION:             'An admin accessed a protected data endpoint.',
};

const EVENT_TYPES = Object.keys(TYPE_LABELS) as EventType[];
const SEVERITIES: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE[severity]}`}>
      {severity}
    </span>
  );
}

function EventDetailSheet({ event, open, onClose }: {
  event: SecurityEvent | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!event) return null;
  const Icon = TYPE_ICON[event.type];

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex size-10 items-center justify-center rounded-lg ${SEVERITY_CARD[event.severity]}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-base">{TYPE_LABELS[event.type]}</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">
                {new Date(event.created_at).toLocaleString()}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 mt-2">
          {/* Description */}
          <p className="text-sm text-muted-foreground">{TYPE_DESCRIPTION[event.type]}</p>

          <Separator />

          {/* Severity */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Severity</p>
            <SeverityBadge severity={event.severity} />
          </div>

          {/* User */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User</p>
            {event.user ? (
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">{event.user.first_name} {event.user.last_name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{event.user.email}</p>
                <p className="text-muted-foreground text-xs font-mono mt-0.5">{event.user.id}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No user associated (unauthenticated request)</p>
            )}
          </div>

          {/* Network */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Network</p>
            <div className="rounded-md border p-3 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address</span>
                <span className="font-mono text-xs">{event.ip_address ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">User Agent</span>
                <span className="text-xs text-right break-all">{event.user_agent ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Details</p>
              <div className="rounded-md border p-3 space-y-1.5">
                {Object.entries(event.metadata).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground shrink-0">{k.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-xs text-right break-all">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event ID */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Event ID</p>
            <p className="text-xs font-mono text-muted-foreground break-all">{event.id}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
    <Skeleton className="mx-6 h-96" />
  </div>
);

export default function SecurityEventsPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ limit: '100' });
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (severityFilter !== 'all') params.set('severity', severityFilter);

      const [eventsRes, statsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: SecurityEventsResponse }>(`/admin/security-events?${params}`),
        apiClient.get<{ success: boolean; data: SecurityStats }>('/admin/security-events/stats'),
      ]);

      setEvents(eventsRes.data.data.events);
      setTotal(eventsRes.data.data.total);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security events');
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, severityFilter]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleRowClick = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setSheetOpen(true);
  };

  const columns: ColumnDef<SecurityEvent>[] = [
    {
      accessorKey: 'created_at',
      header: 'Time',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Event',
      cell: ({ row }) => {
        const Icon = TYPE_ICON[row.original.type];
        return (
          <div className="flex items-center gap-2">
            <Icon className="size-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium text-sm">{TYPE_LABELS[row.original.type]}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const u = row.original.user;
        if (!u) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{u.first_name} {u.last_name}</span>
            <span className="text-xs text-muted-foreground">{u.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'ip_address',
      header: 'IP Address',
      cell: ({ row }) => (
        <span className="text-xs font-mono">{row.original.ip_address ?? '—'}</span>
      ),
    },
  ];

  const filters = (
    <>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {EVENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={severityFilter} onValueChange={setSeverityFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          {SEVERITIES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <PageHeader
        title="Security Events"
        description="Monitor authentication and security incidents across the platform"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Security' }]}
      />

      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="p-6"><ErrorAlert message={error} onRetry={fetchData} /></div>}

        {!isLoading && !error && stats && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
              <StatsCard title="Total Events" value={stats.total} description="All time" icon={Activity} />
              <StatsCard title="Last 24 Hours" value={stats.last24h} description="Recent activity" icon={ShieldAlert} />
              <StatsCard title="Failed Logins" value={stats.by_type.LOGIN_FAILED ?? 0} description="All time" icon={ShieldX} />
              <StatsCard title="Lock Events" value={stats.by_type.ACCOUNT_LOCKED ?? 0} description="All time" icon={AlertTriangle} />
            </div>

            {/* Severity breakdown */}
            <div className="grid gap-3 md:grid-cols-4 px-6">
              {SEVERITIES.map((s) => (
                <div key={s} className="rounded-lg border bg-card p-4">
                  <p className={`text-xs font-medium uppercase tracking-wide ${SEVERITY_TEXT[s]}`}>{s}</p>
                  <p className="text-2xl font-bold mt-1">{stats.by_severity[s] ?? 0}</p>
                </div>
              ))}
            </div>

            <div className="rounded-md border bg-card mx-6 mb-6">
              <div className="flex flex-col space-y-1.5 p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">Event Log</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click any row to view full incident details.
                    </p>
                  </div>
                  <Badge variant="outline">{total} total</Badge>
                </div>
              </div>
              <div className="p-6">
                <AdminDataTable
                  columns={columns}
                  data={events}
                  searchColumn="type"
                  searchPlaceholder="Search by event type..."
                  emptyMessage="No security events found."
                  filters={filters}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <EventDetailSheet
        event={selectedEvent}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
