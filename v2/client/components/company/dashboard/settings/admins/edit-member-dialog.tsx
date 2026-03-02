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
import { AdminPermissions, AdminUser } from "@/data/mock-admins";

const editAdminSchema = z.object({
  position: z.string().min(1, "Position is required"),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canPostJob: z.boolean(),
});

type EditAdminValues = z.infer<typeof editAdminSchema>;

interface EditMemberDialogProps {
  admin: AdminUser;
  onUpdate: (id: string, data: { position: string; permissions: AdminPermissions }) => void;
}

export function EditMemberDialog({ admin, onUpdate }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditAdminValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      position: admin.position,
      canEdit: admin.permissions.canEdit,
      canDelete: admin.permissions.canDelete,
      canPostJob: admin.permissions.canPostJob,
    },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      form.reset({
        position: admin.position,
        canEdit: admin.permissions.canEdit,
        canDelete: admin.permissions.canDelete,
        canPostJob: admin.permissions.canPostJob,
      });
    }
  };

  async function onSubmit(data: EditAdminValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onUpdate(admin.id, {
      position: data.position,
      permissions: {
        canEdit: data.canEdit,
        canDelete: data.canDelete,
        canPostJob: data.canPostJob,
      },
    });
    setIsSubmitting(false);
    setOpen(false);
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
            {/* Read-only email */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {admin.email}
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

              <FormField
                control={form.control}
                name="canEdit"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Allow Edit
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canDelete"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Allow Delete
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canPostJob"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Allow Post Jobs
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
