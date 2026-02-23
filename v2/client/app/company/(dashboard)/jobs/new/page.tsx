"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { JobForm } from "@/components/company/dashboard/jobs/forms/job-form";

export default function NewJobPage() {
  return (
    <>
      <PageHeader
        title="Post New Job"
        description="Create a new job posting"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Jobs", href: "/company/jobs" },
          { label: "New Job" },
        ]}
      />
      <div className="flex flex-1 flex-col p-6">
        <JobForm mode="create" />
      </div>
    </>
  );
}
