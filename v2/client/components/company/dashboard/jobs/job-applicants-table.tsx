"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Mail } from "lucide-react";
import { JobApplication, ApplicationStatus } from "@/types/job";
import { Candidate } from "@/types/candidate";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface JobApplicantsTableProps {
  applications: (JobApplication & { candidate?: Candidate })[];
}

const statusColors: Record<ApplicationStatus, string> = {
  New: "bg-blue-100 text-blue-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interview: "bg-purple-100 text-purple-800",
  Offer: "bg-green-100 text-green-800",
  Hired: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};

export function JobApplicantsTable({ applications }: JobApplicantsTableProps) {
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
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                <Link
                  href={`/company/applicants/${app.candidateId}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={app.candidate?.profilePhoto}
                      alt={app.candidate?.fullName}
                    />
                    <AvatarFallback>
                      {app.candidate?.firstName[0]}
                      {app.candidate?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{app.candidate?.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.candidate?.title}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(statusColors[app.status])}
                >
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(app.appliedAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(app.lastUpdated)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-64">
                    <DropdownMenuItem asChild>
                      <Link href={`/company/applicants/${app.candidateId}`}>
                        <Eye className="mr-2 size-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 size-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Move to Interview</DropdownMenuItem>
                    <DropdownMenuItem>Move to Offer</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
