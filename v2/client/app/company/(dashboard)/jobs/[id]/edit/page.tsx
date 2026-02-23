"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { JobForm } from "@/components/company/dashboard/jobs/forms/job-form";
import { getJobById } from "@/data";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = use(params);
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Job"
        description={`Editing: ${job.title}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/company/" },
          { label: "Jobs", href: "/company/jobs" },
          { label: job.title, href: `/company/jobs/${id}` },
          { label: "Edit" },
        ]}
      />
      <div className="flex flex-1 flex-col p-6">
        <JobForm job={job} mode="edit" />
      </div>
    </>
  );
}
