import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApplicationStats } from "@/api/types";

interface ApplicationStatsProps {
  stats: ApplicationStats | null;
  isLoading?: boolean;
}

export function ApplicationStats({ stats, isLoading }: ApplicationStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.SCREENING + stats.INTERVIEW}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.OFFER + stats.HIRED}
          </div>
          <div className="text-sm text-muted-foreground">Offers / Hired</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-500">
            {stats.REJECTED}
          </div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </CardContent>
      </Card>
    </div>
  );
}
