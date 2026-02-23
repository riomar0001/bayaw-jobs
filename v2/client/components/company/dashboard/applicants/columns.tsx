"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
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
import { MoreHorizontal, Eye, Mail, Star, ArrowUpDown } from "lucide-react";
import { JobApplication, ApplicationStatus } from "@/types/job";
import { Candidate } from "@/types/candidate";
import { Job } from "@/types/job";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface ApplicantWithDetails extends JobApplication {
  candidate?: Candidate;
  job?: Job;
}

const statusColors: Record<ApplicationStatus, string> = {
  New: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Screening: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Interview: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Offer: "bg-green-100 text-green-800 hover:bg-green-100",
  Hired: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-100",
};

export const columns: ColumnDef<ApplicantWithDetails>[] = [
  {
    id: "candidate",
    accessorFn: (row) => row.candidate?.fullName ?? "",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Candidate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const app = row.original;
      return (
        <Link
          href={`/company/applicants/${app.candidateId}`}
          className="flex items-center gap-3 hover:underline px-4"
        >
          <Avatar className="size-9 shrink-0">
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
            <p className="font-medium leading-none">
              {app.candidate?.fullName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {app.candidate?.title}
            </p>
          </div>
        </Link>
      );
    },
  },
  {
    id: "jobTitle",
    accessorFn: (row) => row.job?.title ?? "",
    header: "Applied For",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <Link
          href={`/company/jobs/${app.jobId}`}
          className="text-sm hover:underline text-muted-foreground"
        >
          {app.job?.title}
        </Link>
      );
    },
  },
  {
    id: "department",
    accessorFn: (row) => row.job?.department ?? "",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.job?.department ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<ApplicationStatus>("status");
      return (
        <Badge variant="secondary" className={cn(statusColors[status])}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue<number | undefined>("rating");
      if (!rating) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Applied
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground px-4">
        {formatDate(row.getValue("appliedAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const app = row.original;
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
      );
    },
  },
];
