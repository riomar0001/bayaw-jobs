import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2 } from "lucide-react";

interface Application {
  jobTitle: string;
  company: string;
}

interface ActiveApplicationsCardProps {
  applications: Application[];
}

export function ActiveApplicationsCard({
  applications,
}: ActiveApplicationsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Active Applications</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {applications.length > 0 ? (
          <>
            {applications.map((application, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm leading-tight mb-1">
                      {application.jobTitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>{application.company}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied 2 days ago
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Pending
                  </Badge>
                </div>
              </div>
            ))}

            <Link href="/applications" className="w-full">
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
