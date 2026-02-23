"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Briefcase, Eye, XCircle } from "lucide-react";
import {
  statusConfig,
  type CandidateApplication as Application,
  type CandidateApplicationStatus as ApplicationStatus,
} from "@/data";

interface ApplicationCardProps {
  application: Application;
}

function getDateString(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil(
    Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const config = statusConfig[application.status as ApplicationStatus];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {application.companyLogo}
              </span>
            </div>
          </div>

          {/* Application Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {application.jobTitle}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{application.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{application.location}</span>
                  </div>
                </div>
              </div>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {application.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Applied {getDateString(application.appliedDate)}</span>
              </div>
              <Badge variant="outline">{application.type}</Badge>
              <span className="text-primary font-medium">
                {application.salary}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-initial"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Job
            </Button>
            {application.status !== "rejected" && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 md:flex-initial text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
