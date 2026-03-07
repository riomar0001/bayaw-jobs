"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Briefcase, MapPin, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Application, ApplicationStatus } from "@/api/types";
import { formatDistanceToNow } from "date-fns";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "New",
    className: "bg-slate-100 text-slate-600 ",
  },
  SCREENING: {
    label: "Screening",
    className: "bg-blue-100 text-blue-700 ",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-purple-100 text-purple-700 ",
  },
  OFFER: {
    label: "Offer",
    className: "bg-cyan-100 text-cyan-700 ",
  },
  HIRED: {
    label: "Hired",
    className: "bg-green-100 text-green-700 ",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 ",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-orange-100 text-orange-700 ",
  },
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERN: "Intern",
};

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const config = STATUS_CONFIG[application.status];
  const { job } = application;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-lg bg-linear-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <span
                className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                  config.className
                }`}
              >
                {config.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Applied{" "}
                  {formatDistanceToNow(new Date(application.application_date), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {job.employment_type && (
                <span className="px-2 py-0.5 text-xs rounded-full border border-border text-muted-foreground">
                  {EMPLOYMENT_TYPE_LABELS[job.employment_type] ??
                    job.employment_type}
                </span>
              )}
              {job.location_type && (
                <span className="px-2 py-0.5 text-xs rounded-full border border-border text-muted-foreground capitalize">
                  {job.location_type.toLowerCase()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
