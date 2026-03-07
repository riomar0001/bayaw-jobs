"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft, Loader2 } from "lucide-react";
import { JobHeader } from "@/components/job/job-header";
import { JobDescription } from "@/components/job/job-description";
import { JobRelated } from "@/components/job/job-related";
import { JobApplyCard } from "@/components/job/job-apply-card";
import { JobOverviewCard } from "@/components/job/job-overview-card";
import { JobCompanyCard } from "@/components/job/job-company-card";
import { jobsService } from "@/api/services/jobs.service";
import { applicantService } from "@/api/services/applicant.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Job } from "@/api/types";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobsService
      .getJob(id)
      .then(setJob)
      .catch(() => setNotFoundError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply() {
    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }
    if (!user?.applicant_profile_id) {
      router.push("/applicant/onboarding");
      return;
    }
    if (!job) return;
    setApplying(true);
    try {
      const res = await applicantService.applyToJob(job.id);
      setJob({
        ...job,
        application: {
          status: res.status,
          application_date: res.application_date,
        },
      });
    } catch {
      // silently fail
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (notFoundError || !job) return notFound();

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
            <JobHeader job={job} onApply={handleApply} applying={applying} />
            <JobDescription job={job} />
            <JobRelated
              companyId={job.company?.id ?? null}
              currentJobId={job.id}
              companyName={job.company?.company_name ?? ""}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <JobApplyCard job={job} onApply={handleApply} applying={applying} />
            <JobOverviewCard job={job} />
            {job.company && <JobCompanyCard company={job.company} />}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
