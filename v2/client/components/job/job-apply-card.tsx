"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import type { Job } from "@/api/types";

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
  onApply: () => void;
  applying: boolean;
}

export function JobApplyCard({ job, onApply, applying }: JobApplyCardProps) {
  const { isAuthenticated } = useAuthStore();
  const application = job.application;

  const appliedDate = application
    ? new Date(application.application_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (!isAuthenticated) return null;

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

  return (
    <Card>
      <CardContent className="p-6">
        <Button className="w-full" onClick={onApply} disabled={applying}>
          {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
}
