'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AdminUser } from './columns';

const DURATION_OPTIONS = [
  { label: '1 day',    value: '1d' },
  { label: '3 days',   value: '3d' },
  { label: '7 days',   value: '7d' },
  { label: '30 days',  value: '30d' },
  { label: 'Permanent', value: 'permanent' },
];

function getDurationDate(value: string): string | undefined {
  if (value === 'permanent') return undefined;
  const days = parseInt(value);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

interface BanModalProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (userId: string, reason: string, expiresAt?: string) => Promise<void>;
}

export function BanModal({ user, open, onClose, onConfirm }: BanModalProps) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('permanent');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await onConfirm(user.id, reason, getDurationDate(duration));
      setReason('');
      setDuration('permanent');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const name = user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email : '';

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban <span className="font-medium">{name}</span> from Job Tally. Their active sessions will be revoked and their jobs will be unpublished.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="reason"
              placeholder="e.g. Violation of terms of service"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
