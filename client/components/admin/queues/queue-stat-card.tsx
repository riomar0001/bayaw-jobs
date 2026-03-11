import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QueueStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';
}

const colorMap: Record<QueueStatCardProps['color'], string> = {
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-600',
};

export function QueueStatCard({ label, value, icon: Icon, color }: QueueStatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex size-10 items-center justify-center rounded-lg', colorMap[color])}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
