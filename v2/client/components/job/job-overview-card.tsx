import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, Briefcase, Clock } from "lucide-react";
import type { Job } from "@/data";

interface JobOverviewCardProps {
  job: Job;
}

export function JobOverviewCard({ job }: JobOverviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Job Overview</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Job Type</p>
              <p className="text-sm font-medium">{job.type}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{job.location}</p>
            </div>
          </div>

          {job.salary && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-sm font-medium">{job.salary}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Posted</p>
              <p className="text-sm font-medium">{job.postedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
