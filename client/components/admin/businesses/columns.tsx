'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Globe } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export interface AdminBusiness {
  id: string;
  company_name: string;
  industry: string;
  company_size: string;
  website: string;
  open_jobs_count: number;
  total_jobs_count: number;
  created_at: string;
}

export const businessColumns: ColumnDef<AdminBusiness>[] = [
  {
    id: 'company',
    accessorKey: 'company_name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const b = row.original;
      return (
        <div className="flex items-center gap-3 px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
            {b.company_name[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-medium leading-none text-sm">{b.company_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{b.industry}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'industry',
    header: 'Industry',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('industry')}</span>
    ),
    filterFn: (row, _id, value) => value === '' || row.original.industry === value,
  },
  {
    accessorKey: 'company_size',
    header: 'Size',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">{row.getValue('company_size')}</Badge>
    ),
  },
  {
    accessorKey: 'open_jobs_count',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Open Jobs
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium px-4">{row.getValue('open_jobs_count')}</span>
    ),
  },
  {
    accessorKey: 'total_jobs_count',
    header: 'Total Jobs',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('total_jobs_count')}</span>
    ),
  },
  {
    accessorKey: 'website',
    header: 'Website',
    cell: ({ row }) => {
      const url = row.getValue<string>('website');
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Globe className="size-3" />
          Visit
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      );
    },
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
