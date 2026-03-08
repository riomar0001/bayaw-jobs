'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, Smartphone, Globe, AlertCircle } from 'lucide-react';
import { authService, LoginHistoryItem } from '@/api';

type DeviceType = 'desktop' | 'mobile' | 'unknown';

function getDeviceType(device: string | null, os: string | null): DeviceType {
  const combined = `${device || ''} ${os || ''}`.toLowerCase();
  if (combined.includes('mobile') || combined.includes('iphone') || combined.includes('android')) {
    return 'mobile';
  }
  if (combined.includes('windows') || combined.includes('mac') || combined.includes('linux')) {
    return 'desktop';
  }
  return 'unknown';
}

function formatLocation(item: LoginHistoryItem): string {
  const parts = [item.city, item.region, item.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown location';
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function maskIp(ip: string | null): string {
  if (!ip) return 'Unknown IP';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  return ip;
}

const DeviceIcon = ({ type }: { type: DeviceType }) => {
  if (type === 'mobile') return <Smartphone className="size-4 text-muted-foreground" />;
  if (type === 'desktop') return <Monitor className="size-4 text-muted-foreground" />;
  return <Globe className="size-4 text-muted-foreground" />;
};

function LoginHistorySkeleton() {
  return (
    <div className="divide-y">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoginHistory() {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLoginHistory() {
      try {
        setIsLoading(true);
        const response = await authService.getLoginHistory();
        setLoginHistory(response.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load login history';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLoginHistory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoginHistorySkeleton />
        ) : error ? (
          <div className="flex items-center gap-2 text-sm text-destructive py-4">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        ) : loginHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No login history available.</p>
        ) : (
          <div className="divide-y">
            {loginHistory.map((item) => {
              const deviceType = getDeviceType(item.device, item.os);
              const deviceDisplay = item.os || item.device || 'Unknown Device';
              const browserDisplay = item.browser || 'Unknown Browser';

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                      <DeviceIcon type={deviceType} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {deviceDisplay} · {browserDisplay}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatLocation(item)} · {maskIp(item.ip_address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant={item.is_active ? 'secondary' : 'outline'} className="text-xs">
                      {item.is_active ? 'Active' : 'Expired'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
