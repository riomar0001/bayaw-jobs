'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Mail,
  ArrowUpDown,
  UserCheck,
  XCircle,
  Clock,
  Briefcase,
  FileCheck,
  Ban,
} from 'lucide-react';
import { CompanyJobApplicant, ApplicationStatus } from '@/api/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const statusColors: Record<ApplicationStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  SCREENING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  INTERVIEW: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  OFFER: 'bg-green-100 text-green-800 hover:bg-green-100',
  HIRED: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  REJECTED: 'bg-red-100 text-red-800 hover:bg-red-100',
  CANCELLED: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
};

const statusOptions: { value: ApplicationStatus; label: string; icon: React.ElementType }[] = [
  { value: 'NEW', label: 'New', icon: Clock },
  { value: 'SCREENING', label: 'Screening', icon: FileCheck },
  { value: 'INTERVIEW', label: 'Interview', icon: Briefcase },
  { value: 'OFFER', label: 'Offer', icon: UserCheck },
  { value: 'HIRED', label: 'Hired', icon: UserCheck },
  { value: 'REJECTED', label: 'Rejected', icon: XCircle },
  { value: 'CANCELLED', label: 'Cancelled', icon: Ban },
];

interface ColumnsOptions {
  onStatusUpdate?: (applicationId: string, status: ApplicationStatus) => void;
}

export function getColumns(options?: ColumnsOptions): ColumnDef<CompanyJobApplicant>[] {
  const { onStatusUpdate } = options ?? {};

  return [
    {
      id: 'candidate',
      accessorFn: (row) =>
        `${row.applicant_profile.user?.first_name || ''} ${row.applicant_profile.user?.last_name || ''}`.trim() ||
        'Unknown',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Candidate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const app = row.original;
        const firstName = app.applicant_profile.user?.first_name || '';
        const lastName = app.applicant_profile.user?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
        const initials = `${firstName[0] || ''}${lastName[0] || ''}` || '?';
        return (
          <Link
            href={`/company/applicants/${app.id}`}
            className="flex items-center gap-3 hover:underline px-4"
          >
            <Avatar className="size-9 shrink-0">
              <AvatarImage
                src={app.applicant_profile.profile_picture ?? undefined}
                alt={fullName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none">{fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {app.applicant_profile.desired_position}
              </p>
            </div>
          </Link>
        );
      },
    },
    {
      id: 'jobTitle',
      accessorFn: (row) => row.job.title,
      header: 'Applied For',
      cell: ({ row }) => {
        const app = row.original;
        return <span className="text-sm text-muted-foreground">{app.job.title}</span>;
      },
    },
    {
      id: 'department',
      accessorFn: (row) => row.job.department,
      header: 'Department',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.job.department}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<ApplicationStatus>('status');
        return (
          <Badge variant="secondary" className={cn(statusColors[status])}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'application_date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground px-4">
          {formatDate(row.getValue('application_date'))}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const app = row.original;
        const currentStatus = app.status;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem asChild>
                <Link href={`/company/applicants/${app.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`mailto:${app.applicant_profile.user?.first_name ?? 'applicant'}@example.com`}
                >
                  <Mail className="mr-2 size-4" />
                  Send Email
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onStatusUpdate && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Briefcase className="mr-2 size-4" />
                    Change Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {statusOptions.map(({ value, label, icon: Icon }) => (
                      <DropdownMenuItem
                        key={value}
                        disabled={currentStatus === value}
                        onClick={() => onStatusUpdate(app.id, value)}
                        className={cn(currentStatus === value && 'bg-muted')}
                      >
                        <Icon className="mr-2 size-4" />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// Keep backward compatibility
export const columns = getColumns();
