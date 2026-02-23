import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";
import type { Job } from "@/data";

interface CompanyOpenPositionsProps {
  jobs: Job[];
}

export function CompanyOpenPositions({ jobs }: CompanyOpenPositionsProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Open Positions</h2>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          </Badge>
        </div>

        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </span>
                    )}
                    <Badge variant="secondary" className="text-xs py-0">
                      {job.type}
                    </Badge>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 ml-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No open positions at the moment. Check back soon!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
