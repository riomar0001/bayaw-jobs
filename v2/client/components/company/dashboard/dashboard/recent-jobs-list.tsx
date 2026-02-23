"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Briefcase } from "lucide-react";
import { getRecentJobs } from "@/data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Draft: "bg-gray-100 text-gray-800",
  Paused: "bg-yellow-100 text-yellow-800",
  Closed: "bg-red-100 text-red-800",
};

export function RecentJobsList() {
  const recentJobs = getRecentJobs(5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Posted Jobs</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/company/jobs">
            View All
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentJobs.map((job) => (
          <Link
            key={job.id}
            href={`/company/jobs/${job.id}`}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{job.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {job.applicantCount} applicants
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn("text-xs", statusColors[job.status])}
            >
              {job.status}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
