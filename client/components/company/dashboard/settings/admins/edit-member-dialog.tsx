"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Pencil } from "lucide-react";
import type { CompanyAdmin, UpdateAdminInput } from "@/api/types";

const editAdminSchema = z.object({
  position: z.string().trim().max(100, "Position is too long"),
  can_update: z.boolean(),
  can_delete: z.boolean(),
  can_create: z.boolean(),
});

type EditAdminValues = z.infer<typeof editAdminSchema>;

const PERMISSION_FIELDS: { name: "can_update" | "can_delete" | "can_create"; label: string }[] = [
  { name: "can_update", label: "Allow Edit" },
  { name: "can_delete", label: "Allow Delete" },
  { name: "can_create", label: "Allow Post Jobs" },
];

interface EditMemberDialogProps {
  admin: CompanyAdmin;
  /** Rejects on failure; the dialog then stays open so the change isn't lost. */
  onUpdate: (id: string, data: UpdateAdminInput) => Promise<void>;
}

function valuesFrom(admin: CompanyAdmin): EditAdminValues {
  return {
    position: admin.position ?? "",
    can_update: admin.can_update,
    can_delete: admin.can_delete,
    can_create: admin.can_create,
  };
}

export function EditMemberDialog({ admin, onUpdate }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditAdminValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: valuesFrom(admin),
  });

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    setOpen(next);
    if (!next) form.reset(valuesFrom(admin));
  };

  async function onSubmit(data: EditAdminValues) {
    setIsSubmitting(true);
    try {
      await onUpdate(admin.id, data);
      setOpen(false);
    } catch {
      // The caller already showed the error; keep the dialog open for another try.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Pencil className="mr-2 size-4" />
          Edit Member
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {admin.user.email}
              </p>
            </div>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. HR Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium">Permissions</p>
              {PERMISSION_FIELDS.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">{label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
