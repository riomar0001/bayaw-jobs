"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Building2,
  CalendarDays,
  Loader2,
} from "lucide-react";
import type { Job } from "@/api/types";

const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
};

interface JobHeaderProps {
  job: Job;
  onApply: () => void;
  applying: boolean;
}

export function JobHeader({ job, onApply, applying }: JobHeaderProps) {
  const companyName = job.company?.company_name ?? "";
  const companyId = job.company?.id;
  const postedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
              <Link
                href={companyId ? `/companies/${companyId}` : "#"}
                className="text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Building2 className="h-4 w-4" />
                {companyName}
              </Link>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 shrink-0"
          >
            {EMPLOYMENT_TYPE_LABEL[job.employment_type] ?? job.employment_type}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary/70" />
            {job.location}
          </div>
          {(job.minimum_salary || job.maximum_salary) && (
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              {job.minimum_salary && job.maximum_salary
                ? `${job.currency} ${job.minimum_salary} – ${job.maximum_salary}`
                : `${job.currency} ${job.minimum_salary ?? job.maximum_salary}`}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary/70" />
            Posted {postedDate}
          </div>
        </div>

        {!job.application && (
          <Button
            size="lg"
            className="w-full sm:w-auto px-12"
            onClick={onApply}
            disabled={applying}
          >
            {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Apply Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
