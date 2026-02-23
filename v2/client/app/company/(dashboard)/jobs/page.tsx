"use client";

import Link from "next/link";
import { Plus, Briefcase, Users, Eye, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/company/dashboard/dashboard/stats-card";
import { DataTable } from "@/components/company/dashboard/jobs/data-table";
import { columns } from "@/components/company/dashboard/jobs/columns";
import { mockJobs } from "@/data";

export default function JobsPage() {
  const totalJobs = mockJobs.length;
  const activeJobs = mockJobs.filter((j) => j.status === "Active").length;
  const totalApplicants = mockJobs.reduce(
    (sum, j) => sum + j.applicantCount,
    0,
  );
  const totalViews = mockJobs.reduce((sum, j) => sum + j.viewCount, 0);

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Manage your job postings"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Jobs" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Jobs" value={totalJobs} icon={Briefcase} />
          <StatsCard title="Active Jobs" value={activeJobs} icon={TrendingUp} />
          <StatsCard
            title="Total Applicants"
            value={totalApplicants}
            icon={Users}
          />
          <StatsCard title="Total Views" value={totalViews} icon={Eye} />
        </div>

        {/* Jobs Table */}
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                All Jobs
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your job postings and applicants.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/company/jobs/new">
                <Plus className="mr-2 size-4" />
                Post New Job
              </Link>
            </Button>
          </div>
          <div className="p-6 pt-0">
            <DataTable columns={columns} data={mockJobs} />
          </div>
        </div>
      </div>
    </>
  );
}
