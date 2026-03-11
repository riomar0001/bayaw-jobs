import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface AdminBusinessRow {
  id: string;
  company_name: string;
  industry: string;
  company_size: string;
  open_jobs_count: number;
  created_at: string;
}

interface BusinessesOverviewProps {
  businesses: AdminBusinessRow[];
}

export function BusinessesOverview({ businesses }: BusinessesOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Businesses</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/businesses">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {businesses.map((biz) => (
            <div key={biz.id} className="flex items-center gap-3 px-6 py-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                {biz.company_name[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{biz.company_name}</p>
                <p className="text-xs text-muted-foreground">{biz.industry}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs">
                  {biz.company_size}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {biz.open_jobs_count} jobs
                </span>
              </div>
            </div>
          ))}
          {businesses.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No businesses found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
