import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import type { ApplicationStatus } from '@/api/types';

export interface AdminApplicantRow {
  id: string;
  first_name: string;
  last_name: string;
  desired_position: string;
  location: string;
  career_status: string | null;
  applications_count: number;
  created_at: string;
}

const careerStatusLabel: Record<string, string> = {
  ACTIVELY_LOOKING: 'Actively Looking',
  OPEN_TO_OPPORTUNITIES: 'Open to Opportunities',
  EMPLOYED_NOT_LOOKING: 'Employed',
  NOT_LOOKING: 'Not Looking',
};

const careerStatusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  ACTIVELY_LOOKING: 'default',
  OPEN_TO_OPPORTUNITIES: 'secondary',
  EMPLOYED_NOT_LOOKING: 'outline',
  NOT_LOOKING: 'outline',
};

interface ApplicantsOverviewProps {
  applicants: AdminApplicantRow[];
}

export function ApplicantsOverview({ applicants }: ApplicantsOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Applicants</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/applicants">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {applicants.map((applicant) => {
            const initials =
              `${applicant.first_name[0] ?? ''}${applicant.last_name[0] ?? ''}`.toUpperCase();
            const status = applicant.career_status;
            return (
              <div key={applicant.id} className="flex items-center gap-3 px-6 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {applicant.first_name} {applicant.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {applicant.desired_position} &middot; {applicant.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {status && (
                    <Badge
                      variant={careerStatusVariant[status] ?? 'outline'}
                      className="text-xs"
                    >
                      {careerStatusLabel[status] ?? status}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {applicant.applications_count} apps
                  </span>
                </div>
              </div>
            );
          })}
          {applicants.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No applicants found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
