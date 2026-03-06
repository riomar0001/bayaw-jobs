"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import type { JobSummary, EmploymentType, LocationType } from "@/api/types";
import { useAuthStore } from "@/stores/auth.store";

const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERN: "Internship",
};

const locationTypeLabels: Record<LocationType, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

interface JobCardProps {
  job: JobSummary;
}

export function JobCard({ job }: JobCardProps) {
  const { isAuthenticated, user } = useAuthStore();

  const applyHref = !isAuthenticated
    ? "/signup"
    : !user?.applicant_profile_id
    ? "/applicant/onboarding"
    : `/jobs/${job.id}`;

  return (
    <Card className="group border hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:border-primary/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20 transition-colors"
          >
            {employmentTypeLabels[job.employment_type] ?? job.employment_type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {locationTypeLabels[job.location_type] ?? job.location_type}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {job.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 relative">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="mr-2 h-4 w-4 text-primary/70" />
            <span className="font-medium">{job.department}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary/70" />
            {job.location}
          </div>
          {(job.minimum_salary || job.maximum_salary) && (
            <div className="flex items-center text-sm font-semibold text-primary">
              <DollarSign className="mr-1 h-4 w-4" />
              {job.currency} {job.minimum_salary} - {job.maximum_salary}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full transition-all">
            View Job
          </Button>
        </Link>
        <Link href={applyHref} className="flex-1">
          <Button className="w-full group-hover:bg-primary group-hover:shadow-lg transition-all">
            Apply Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
