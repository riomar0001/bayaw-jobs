'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Briefcase,
  Clock,
  FileCheck,
  UserCheck,
  XCircle,
  Ban,
} from 'lucide-react';
import { ApplicationStatus } from '@/api/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface JobApplicant {
  id: string;
  status: ApplicationStatus;
  application_date: string;
  applicant_profile: {
    desired_position: string;
    profile_picture: string | null;
    user: {
      first_name: string | null;
      last_name: string | null;
    };
  };
}

interface JobApplicantsTableProps {
  applications: JobApplicant[];
  onStatusUpdate?: (applicationId: string, status: ApplicationStatus) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  SCREENING: 'bg-yellow-100 text-yellow-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
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

export function JobApplicantsTable({ applications, onStatusUpdate }: JobApplicantsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No applicants yet for this job.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => {
            const firstName = app.applicant_profile.user?.first_name ?? '';
            const lastName = app.applicant_profile.user?.last_name ?? '';
            const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
            return (
              <TableRow key={app.id}>
                <TableCell>
                  <Link
                    href={`/company/applicants/${app.id}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={app.applicant_profile.profile_picture ?? undefined}
                        alt={fullName}
                      />
                      <AvatarFallback>
                        {firstName[0] ?? '?'}
                        {lastName[0] ?? ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.applicant_profile.desired_position}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(statusColors[app.status])}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(app.application_date)}
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem>
                        <Mail className="mr-2 size-4" />
                        Send Email
                      </DropdownMenuItem>
                      {onStatusUpdate && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Briefcase className="mr-2 size-4" />
                              Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {statusOptions.map(({ value, label, icon: Icon }) => (
                                <DropdownMenuItem
                                  key={value}
                                  disabled={app.status === value}
                                  onClick={() => onStatusUpdate(app.id, value)}
                                  className={cn(app.status === value && 'bg-muted')}
                                >
                                  <Icon className="mr-2 size-4" />
                                  {label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
