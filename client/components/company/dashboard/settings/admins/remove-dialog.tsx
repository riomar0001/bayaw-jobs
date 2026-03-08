'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Trash2, TriangleAlert, Loader2 } from 'lucide-react';

interface RemoveDialogProps {
  adminName: string;
  adminId: string;
  onRemove: (id: string) => void;
}

export function RemoveDialog({ adminName, adminId, onRemove }: RemoveDialogProps) {
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await onRemove(adminId);
      setOpen(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2 className="mr-2 size-4" />
          Remove Member
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlert className="size-5 text-destructive" />
            Remove Member
          </DialogTitle>
          <DialogDescription>
            This will immediately revoke{' '}
            <span className="font-semibold text-foreground">{adminName}</span>
            &apos;s access to the dashboard. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isRemoving}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isRemoving} onClick={handleRemove}>
            {isRemoving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Remove Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
