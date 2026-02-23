"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, TriangleAlert } from "lucide-react";
import { AdminUser } from "@/data/mock-admins";

interface RemoveDialogProps {
  admin: AdminUser;
  onRemove: (id: string) => void;
}

export function RemoveDialog({ admin, onRemove }: RemoveDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const confirmed = input.trim().toLowerCase() === admin.email.toLowerCase();

  const handleRemove = () => {
    if (!confirmed) return;
    onRemove(admin.id);
    setOpen(false);
    setInput("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            This will immediately revoke{" "}
            <span className="font-semibold text-foreground">{admin.name}</span>
            &apos;s access to the dashboard. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="confirm-email">
            Type{" "}
            <span className="font-medium text-foreground">{admin.email}</span>{" "}
            to confirm
          </Label>
          <Input
            id="confirm-email"
            type="email"
            placeholder={admin.email}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!confirmed}
            onClick={handleRemove}
          >
            Remove Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
