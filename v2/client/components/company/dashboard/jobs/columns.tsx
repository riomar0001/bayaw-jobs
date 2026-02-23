"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/types/job";
import { JobStatusBadge } from "./job-status-badge";
import { formatDistanceToNow } from "@/lib/formatters";
import {
  Users,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const job = row.original;
      return (
        <Link
          href={`/company/jobs/${job.id}`}
          className="font-medium hover:underline px-4"
        >
          {job.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue("department")}
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">{row.getValue("location")}</div>
      );
    },
  },
  {
    accessorKey: "employmentType",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue("employmentType")}
        </div>
      );
    },
  },
  {
    accessorKey: "applicantCount",
    header: () => <div className="text-center">Applicants</div>,
    cell: ({ row }) => {
      const count = parseFloat(row.getValue("applicantCount"));
      return (
        <div className="flex items-center justify-center gap-1">
          <Users className="size-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <JobStatusBadge status={row.getValue("status")} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground px-4">
          {formatDistanceToNow(row.getValue("createdAt"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/company/jobs/${job.id}`}>
                <Eye className="mr-2 size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/company/jobs/${job.id}/edit`}>
                <Pencil className="mr-2 size-4" />
                Edit Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
