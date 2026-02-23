import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import type { Job } from "@/data";

interface JobRelatedProps {
  jobs: Job[];
  companyName: string;
}

export function JobRelated({ jobs, companyName }: JobRelatedProps) {
  if (jobs.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-lg font-semibold mb-4">
          More Jobs at {companyName}
        </h2>
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
            >
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {job.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <Badge variant="secondary" className="text-xs py-0">
                    {job.type}
                  </Badge>
                </div>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
