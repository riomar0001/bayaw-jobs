"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobStatusBadge } from "@/components/company/dashboard/jobs/job-status-badge";
import { JobForm } from "@/components/company/dashboard/jobs/forms/job-form";
import { getJobById } from "@/data";
import { formatSalaryRange } from "@/lib/formatters";
import { JobStatus } from "@/types/job";

const STATUS_ACTIONS: Record<
  JobStatus,
  { label: string; icon: React.ElementType; className?: string }
> = {
  Active: { label: "Publish", icon: CheckCircle2, className: "text-green-600" },
  Draft: { label: "Move to Draft", icon: FileText },
  Paused: {
    label: "Pause",
    icon: PauseCircle,
    className: "text-yellow-600",
  },
  Closed: { label: "Close Job", icon: XCircle, className: "text-destructive" },
};

const ALL_STATUSES: JobStatus[] = ["Active", "Draft", "Paused", "Closed"];

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = use(params);
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const [currentStatus, setCurrentStatus] = useState<JobStatus>(job.status);
  const otherStatuses = ALL_STATUSES.filter((s) => s !== currentStatus);

  return (
    <>
      <PageHeader
        title="Edit Job"
        breadcrumbs={[
          { label: "Dashboard", href: "/company/" },
          { label: "Jobs", href: "/company/jobs" },
          { label: job.title, href: `/company/jobs/${id}` },
          { label: "Edit" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Job Header Card */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <JobStatusBadge status={currentStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {job.location} · {job.locationType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5" />
                    {formatSalaryRange(
                      job.salaryRange.min,
                      job.salaryRange.max,
                      job.salaryRange.currency,
                    )}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Update Status
                    <ChevronDown className="ml-1 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {otherStatuses.map((status) => {
                    const { label, icon: Icon, className } =
                      STATUS_ACTIONS[status];
                    return (
                      <DropdownMenuItem
                        key={status}
                        className={className}
                        onClick={() => setCurrentStatus(status)}
                      >
                        <Icon className="mr-2 size-4" />
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <JobForm job={job} mode="edit" />
      </div>
    </>
  );
}
