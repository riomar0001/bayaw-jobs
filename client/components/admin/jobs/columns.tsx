'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';
import type { JobStatus, EmploymentType, LocationType } from '@/api/types';

export interface AdminJob {
  id: string;
  title: string;
  department: string;
  company_name: string;
  location: string;
  location_type: LocationType;
  employment_type: EmploymentType;
  status: JobStatus;
  applicant_count: number;
  created_at: string;
}

const jobStatusStyle: Record<JobStatus, string> = {
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-700',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  DRAFT: 'bg-blue-100 text-blue-800',
};

const employmentTypeLabel: Record<EmploymentType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERN: 'Intern',
};

const locationTypeStyle: Record<LocationType, string> = {
  ONSITE: 'bg-orange-100 text-orange-800',
  REMOTE: 'bg-teal-100 text-teal-800',
  HYBRID: 'bg-purple-100 text-purple-800',
};

export const jobColumns: ColumnDef<AdminJob>[] = [
  {
    id: 'job',
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const j = row.original;
      return (
        <div className="px-4">
          <p className="font-medium text-sm leading-none">{j.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{j.department}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'company_name',
    header: 'Company',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('company_name')}</span>
    ),
    filterFn: (row, _id, value) =>
      value === '' || row.original.company_name.toLowerCase().includes(value.toLowerCase()),
  },
  {
    accessorKey: 'employment_type',
    header: 'Type',
    cell: ({ row }) => {
      const t = row.getValue<EmploymentType>('employment_type');
      return <Badge variant="outline" className="text-xs">{employmentTypeLabel[t] ?? t}</Badge>;
    },
    filterFn: (row, _id, value) => value === '' || row.original.employment_type === value,
  },
  {
    accessorKey: 'location_type',
    header: 'Work Mode',
    cell: ({ row }) => {
      const lt = row.getValue<LocationType>('location_type');
      return (
        <Badge variant="secondary" className={cn('text-xs', locationTypeStyle[lt])}>
          {lt}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.getValue<JobStatus>('status');
      return (
        <Badge variant="secondary" className={cn('text-xs', jobStatusStyle[s])}>
          {s}
        </Badge>
      );
    },
    filterFn: (row, _id, value) => value === '' || row.original.status === value,
  },
  {
    accessorKey: 'applicant_count',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Applicants
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium px-4">{row.getValue('applicant_count')}</span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Posted
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
