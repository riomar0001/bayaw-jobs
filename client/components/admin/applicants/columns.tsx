'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';

export interface AdminApplicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  desired_position: string;
  location: string;
  career_status: string | null;
  applications_count: number;
  created_at: string;
}

const careerStatusLabel: Record<string, string> = {
  ACTIVELY_LOOKING: 'Actively Looking',
  OPEN_TO_OPPORTUNITIES: 'Open',
  EMPLOYED_NOT_LOOKING: 'Employed',
  NOT_LOOKING: 'Not Looking',
};

const careerStatusStyle: Record<string, string> = {
  ACTIVELY_LOOKING: 'bg-green-100 text-green-800',
  OPEN_TO_OPPORTUNITIES: 'bg-blue-100 text-blue-800',
  EMPLOYED_NOT_LOOKING: 'bg-gray-100 text-gray-700',
  NOT_LOOKING: 'bg-gray-100 text-gray-500',
};

export const applicantColumns: ColumnDef<AdminApplicant>[] = [
  {
    id: 'name',
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Applicant
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const a = row.original;
      const initials = `${a.first_name[0] ?? ''}${a.last_name[0] ?? ''}`.toUpperCase();
      return (
        <div className="flex items-center gap-3 px-4">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none text-sm">{a.first_name} {a.last_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'desired_position',
    header: 'Desired Position',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('desired_position')}</span>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('location')}</span>
    ),
  },
  {
    accessorKey: 'career_status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue<string | null>('career_status');
      if (!s) return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <Badge variant="secondary" className={cn('text-xs', careerStatusStyle[s] ?? 'bg-gray-100')}>
          {careerStatusLabel[s] ?? s}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => value === '' || row.original.career_status === value,
  },
  {
    accessorKey: 'applications_count',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Applications
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium px-4">{row.getValue('applications_count')}</span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Registered
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground px-4">
        {formatDate(row.getValue('created_at'))}
      </span>
    ),
  },
];
