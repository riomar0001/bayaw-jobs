'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PipelineItem } from '@/api/types';
import { cn } from '@/lib/utils';

const stageColors: Record<string, string> = {
  NEW: 'bg-blue-500',
  SCREENING: 'bg-yellow-500',
  INTERVIEW: 'bg-purple-500',
  OFFER: 'bg-green-500',
  HIRED: 'bg-emerald-500',
  REJECTED: 'bg-gray-400',
};

const stageLabels: Record<string, string> = {
  NEW: 'New',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

interface ApplicationPipelineProps {
  data?: PipelineItem[];
}

export function ApplicationPipeline({ data = [] }: ApplicationPipelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <div key={item.status} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stageLabels[item.status] ?? item.status}</span>
              <span className="text-muted-foreground">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', stageColors[item.status] ?? 'bg-gray-400')}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
