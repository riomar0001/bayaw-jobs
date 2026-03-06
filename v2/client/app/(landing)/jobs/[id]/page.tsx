"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { jobs, companies } from "@/data";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft } from "lucide-react";
import { JobHeader } from "@/components/job/job-header";
import { JobDescription } from "@/components/job/job-description";
import { JobRelated } from "@/components/job/job-related";
import { JobApplyCard } from "@/components/job/job-apply-card";
import { JobOverviewCard } from "@/components/job/job-overview-card";
import { JobCompanyCard } from "@/components/job/job-company-card";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = jobs.find((j) => j.id === id);

  if (!job) notFound();

  const company = companies.find(
    (c) => c.name.toLowerCase() === job.company.toLowerCase(),
  );

  const relatedJobs = jobs
    .filter((j) => j.id !== job.id && j.company === job.company)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="fixed top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-10 relative z-10 max-w-6xl">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <JobHeader job={job} company={company} />
            <JobDescription job={job} />
            <JobRelated jobs={relatedJobs} companyName={job.company} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <JobApplyCard />
            <JobOverviewCard job={job} />
            {company && <JobCompanyCard company={company} />}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
