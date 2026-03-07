'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { DashboardData } from '@/api/types';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  SCREENING: 'bg-yellow-100 text-yellow-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  NEW: 'New',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

interface RecentApplicantsListProps {
  applicants?: DashboardData['recent_applicants'];
}

export function RecentApplicantsList({ applicants = [] }: RecentApplicantsListProps) {
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
        {applicants.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent applicants</p>
        ) : (
          applicants.map((app) => (
            <Link
              key={app.id}
              href={`/company/applicants/${app.id}`}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={app.applicant_profile.profile_picture ?? undefined}
                    alt={`${app.applicant_profile.user.first_name} ${app.applicant_profile.user.last_name}`}
                  />
                  <AvatarFallback>
                    {app.applicant_profile.user.first_name[0]}
                    {app.applicant_profile.user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {app.applicant_profile.user.first_name} {app.applicant_profile.user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">Applied for {app.job.title}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn('text-xs', statusColors[app.status] ?? 'bg-gray-100 text-gray-800')}
              >
                {statusLabels[app.status] ?? app.status}
              </Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
