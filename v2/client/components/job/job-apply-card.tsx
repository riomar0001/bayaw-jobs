"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { applicantService } from "@/api/services/applicant.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Job, JobApplication } from "@/api/types";

const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  HIRED: "Hired",
  CANCELLED: "Cancelled",
};

interface JobApplyCardProps {
  job: Job;
  onApplied: (updated: Job) => void;
}

export function JobApplyCard({ job, onApplied }: JobApplyCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [applying, setApplying] = useState(false);
  const application: JobApplication | undefined = job.application;

  const appliedDate = application
    ? new Date(application.application_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  async function handleApply() {
    setApplying(true);
    try {
      const res = await applicantService.applyToJob(job.id);
      onApplied({
        ...job,
        application: {
          status: res.status,
          application_date: res.application_date,
        },
      });
    } catch {
      // silently fail — server errors remain visible in dev tools
    } finally {
      setApplying(false);
    }
  }

  if (application) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Application Submitted</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Clock className="h-3 w-3" />
                {appliedDate}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
              {STATUS_LABEL[application.status] ?? application.status}
            </span>
          </div>

          <Link href="/applications">
            <Button variant="outline" className="w-full" size="sm">
              View All Applications
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user?.applicant_profile_id) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            Complete your applicant profile to apply for jobs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Button className="w-full" onClick={handleApply} disabled={applying}>
          {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
}
