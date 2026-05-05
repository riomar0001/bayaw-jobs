'use client';

import { useAuthStore } from '@/stores/auth.store';
import { ShieldBan } from 'lucide-react';

export default function BannedPage() {
  const user = useAuthStore((s) => s.user);

  const banReason = (user as (typeof user & { ban_reason?: string | null }) | null)?.ban_reason;
  const banExpiresAt = (user as (typeof user & { ban_expires_at?: string | null }) | null)?.ban_expires_at;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldBan className="size-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Account Suspended</h1>
          <p className="text-muted-foreground text-sm">
            Your account has been banned from Job Tally.
          </p>
        </div>

        {banReason && (
          <div className="rounded-lg border bg-muted/50 p-4 text-left space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reason</p>
            <p className="text-sm">{banReason}</p>
          </div>
        )}

        {banExpiresAt && (
          <div className="rounded-lg border bg-muted/50 p-4 text-left space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ban expires</p>
            <p className="text-sm">{new Date(banExpiresAt).toLocaleString()}</p>
          </div>
        )}

        {!banExpiresAt && (
          <p className="text-xs text-muted-foreground">This ban is permanent.</p>
        )}

        <p className="text-xs text-muted-foreground">
          If you believe this is a mistake, please contact support at{' '}
          <span className="font-medium">support@jobtally.com</span>.
        </p>
      </div>
    </div>
  );
}
