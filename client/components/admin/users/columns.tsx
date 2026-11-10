'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';

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
  return (
    <span className="text-xs text-orange-700 font-medium">
      {mins}m {secs}s
    </span>
  );
}

export interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  status: string;
  email_verified: boolean;
  created_at: string;
  last_login_at: string | null;
  locked_until: string | null;
  ban_reason: string | null;
  ban_expires_at: string | null;
  banned_at: string | null;
}

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

export const userColumns: ColumnDef<AdminUser>[] = [
  {
    id: 'name',
    accessorFn: (row) =>
      `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.email,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
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
      return (
        <Badge variant="secondary" className={cn('text-xs', roleVariant[role] ?? 'bg-gray-100')}>
          {role}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => value === '' || row.original.role === value,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return (
        <Badge variant="secondary" className={cn('text-xs', statusVariant[status] ?? 'bg-gray-100')}>
          {status.replace('_', ' ')}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => value === '' || row.original.status === value,
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
        Joined
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground px-4">
        {formatDate(row.getValue('created_at'))}
      </span>
    ),
  },
  {
    accessorKey: 'last_login_at',
    header: 'Last Login',
    cell: ({ row }) => {
      const v = row.getValue<string | null>('last_login_at');
      return (
        <span className="text-sm text-muted-foreground">
          {v ? formatDate(v) : '—'}
        </span>
      );
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
];
