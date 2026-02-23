import { Card, CardContent } from "@/components/ui/card";
import type { CandidateApplication as Application } from "@/data";

interface ApplicationStatsProps {
  applications: Application[];
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">
            {applications.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Applications
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status === "reviewing").length}
          </div>
          <div className="text-sm text-muted-foreground">Under Review</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "interview").length}
          </div>
          <div className="text-sm text-muted-foreground">Interview Stage</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {applications.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </CardContent>
      </Card>
    </div>
  );
}
