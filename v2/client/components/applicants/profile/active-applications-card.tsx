"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Loader2 } from "lucide-react";
import { applicantService } from "@/api/services/applicant.service";
import { type ActiveApplication } from "@/api/types";
import { formatDistanceToNow } from "date-fns";

export function ActiveApplicationsCard() {
  const [applications, setApplications] = useState<ActiveApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await applicantService.getActiveApplications();
        // Get only the top 3
        setApplications(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch active applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Active Applications</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : applications.length > 0 ? (
          <>
            {applications.map((application) => (
              <div
                key={application.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm leading-tight mb-1">
                      {application.job.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>
                        {application.job.company_information.company_name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied{" "}
                      {formatDistanceToNow(
                        new Date(application.application_date),
                        { addSuffix: true },
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {application.status.charAt(0) +
                      application.status
                        .slice(1)
                        .toLowerCase()
                        .replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            ))}

            <Link href="/applicant/applications" className="w-full">
              <Button variant="outline" className="w-full mt-2" size="sm">
                View All Applications
              </Button>
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active applications yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
