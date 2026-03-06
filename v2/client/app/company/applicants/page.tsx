"use client";

import { Users, UserCheck, Clock, XCircle } from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { StatsCard } from "@/components/company/dashboard/dashboard/stats-card";
import { DataTable } from "@/components/company/dashboard/applicants/data-table";
import { columns } from "@/components/company/dashboard/applicants/columns";
import {
  mockApplications,
  getApplicationStats,
  mockCandidates,
  mockJobs,
} from "@/data";

export default function ApplicantsPage() {
  const stats = getApplicationStats();

  const applicantsWithDetails = mockApplications.map((app) => ({
    ...app,
    candidate: mockCandidates.find((c) => c.id === app.candidateId),
    job: mockJobs.find((j) => j.id === app.jobId),
  }));

  return (
    <>
      <PageHeader
        title="Applicants"
        description="Manage all applicants across job postings"
        breadcrumbs={[
          { label: "Dashboard", href: "/company/" },
          { label: "Applicants" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Applicants"
            value={stats.total}
            icon={Users}
          />
          <StatsCard
            title="In Interview"
            value={stats.interview}
            icon={Clock}
          />
          <StatsCard title="Hired" value={stats.hired} icon={UserCheck} />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        </div>

        {/* Applicants Data Table */}
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              All Applicants
            </h3>
            <p className="text-sm text-muted-foreground">
              Review and manage candidates across all job postings.
            </p>
          </div>
          <div className="p-6 pt-0">
            <DataTable columns={columns} data={applicantsWithDetails} />
          </div>
        </div>
      </div>
    </>
  );
}
