'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddAdminInput } from '@/api/types';
import { Loader2, Plus } from 'lucide-react';

const addAdminSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  role: z.string().min(1, 'Role is required'),
  position: z.string().optional(),
  can_create: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
});

type AddAdminValues = z.infer<typeof addAdminSchema>;

interface InviteDialogProps {
  onAdd: (data: Omit<AddAdminInput, 'can_read'>) => Promise<void>;
  isSubmitting?: boolean;
}

export function InviteDialog({ onAdd, isSubmitting: externalSubmitting }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddAdminValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      email: '',
      role: 'ADMIN',
      position: '',
      can_create: false,
      can_update: false,
      can_delete: false,
    },
  });

  async function onSubmit(data: AddAdminValues) {
    try {
      setIsSubmitting(true);
      await onAdd({
        email: data.email,
        role: data.role,
        position: data.position || undefined,
        can_create: data.can_create,
        can_update: data.can_update,
        can_delete: data.can_delete,
      });
      setOpen(false);
      form.reset();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  }

  const loading = isSubmitting || externalSubmitting;

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
          <DialogDescription>Add a team member to manage your company dashboard.</DialogDescription>
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
                    <Input placeholder="Enter user email" {...field} />
                  </FormControl>
                  <FormDescription>The user must already have an account.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="RECRUITER">Recruiter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position (Optional)</FormLabel>
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
                name="can_create"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Can Create (post jobs, add content)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="can_update"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Can Update (edit jobs, company info)
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="can_delete"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Can Delete (remove jobs, content)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Add Admin
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
