import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, Briefcase, Clock, Monitor } from "lucide-react";
import type { Job } from "@/api/types";

interface JobOverviewCardProps {
  job: Job;
}

const LOCATION_TYPE_LABEL: Record<string, string> = {
  REMOTE: "Remote",
  ONSITE: "On-site",
  HYBRID: "Hybrid",
};

export function JobOverviewCard({ job }: JobOverviewCardProps) {
  const postedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Job Overview</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Job Type</p>
              <p className="text-sm font-medium">{job.employment_type}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Monitor className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Work Setup</p>
              <p className="text-sm font-medium">
                {LOCATION_TYPE_LABEL[job.location_type] ?? job.location_type}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{job.location}</p>
            </div>
          </div>

          {(job.minimum_salary || job.maximum_salary) && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-sm font-medium">
                  {job.minimum_salary && job.maximum_salary
                    ? `${job.currency} ${job.minimum_salary} – ${job.maximum_salary}`
                    : `${job.currency} ${job.minimum_salary ?? job.maximum_salary}`}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Posted</p>
              <p className="text-sm font-medium">{postedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
