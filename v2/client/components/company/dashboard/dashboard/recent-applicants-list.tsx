"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { mockCandidates, mockApplications, mockJobs } from "@/data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interview: "bg-purple-100 text-purple-800",
  Offer: "bg-green-100 text-green-800",
  Hired: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};

export function RecentApplicantsList() {
  // Get recent applications and merge with candidate/job data
  const recentApplications = mockApplications
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    )
    .slice(0, 5)
    .map((app) => {
      const candidate = mockCandidates.find((c) => c.id === app.candidateId);
      const job = mockJobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        candidate,
        job,
      };
    })
    .filter((app) => app.candidate && app.job);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Applicants</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/company/applicants">
            View All
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentApplications.map((app) => (
          <Link
            key={app.id}
            href={`/company/applicants/${app.candidateId}`}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={app.candidate?.profilePhoto}
                  alt={app.candidate?.fullName}
                />
                <AvatarFallback>
                  {app.candidate?.firstName[0]}
                  {app.candidate?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{app.candidate?.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Applied for {app.job?.title}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn("text-xs", statusColors[app.status])}
            >
              {app.status}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
