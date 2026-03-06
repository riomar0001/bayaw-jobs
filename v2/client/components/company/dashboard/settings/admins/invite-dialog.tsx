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
import { AdminPermissions } from "@/data/mock-admins";
import { Loader2, Plus } from "lucide-react";

const addAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canPostJob: z.boolean(),
});

type AddAdminValues = z.infer<typeof addAdminSchema>;

interface AddAdminDialogProps {
  onAdd: (data: {
    email: string;
    position: string;
    permissions: AdminPermissions;
  }) => void;
}

export function InviteDialog({ onAdd }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddAdminValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      email: "",
      position: "",
      canEdit: false,
      canDelete: false,
      canPostJob: false,
    },
  });

  async function onSubmit(data: AddAdminValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onAdd({
      email: data.email,
      position: data.position,
      permissions: {
        canEdit: data.canEdit,
        canDelete: data.canDelete,
        canPostJob: data.canPostJob,
      },
    });
    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="colleague@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Add Admin
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
