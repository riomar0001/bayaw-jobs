"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BusinessLocation } from "@/types/business";
import { Loader2 } from "lucide-react";
import { FieldInfo } from "@/components/company/dashboard/business/field-info";
import { businessService } from "@/api";
import { toast } from "sonner";

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().optional(),
  is_headquarter: z.boolean(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationDialogProps {
  trigger: React.ReactNode;
  location?: BusinessLocation;
  onSave?: (data: LocationFormValues) => void;
}

export function LocationDialog({
  trigger,
  location,
  onSave,
}: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!location;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      address: location?.address || "",
      city: location?.city || "",
      state: location?.state || "",
      country: location?.country || "",
      postal_code: location?.postal_code || "",
      is_headquarter: location?.is_headquarter || false,
    },
  });

  async function onSubmit(data: LocationFormValues) {
    setIsSubmitting(true);

    const payload = {
      ...data,
      state: data.state ?? "",
      postal_code: data.postal_code ?? "",
    };

    const action = isEditing
      ? { success: "updated", error: "update" }
      : { success: "added", error: "add" };

    try {
      const request = isEditing
        ? businessService.updateLocation(location.id, payload)
        : businessService.addLocation(payload);

      await request;

      toast.success(`Location ${action.success} successfully`);
    } catch {
      toast.error(`Failed to ${action.error} location`);
    } finally {
      onSave?.(payload);
      setIsSubmitting(false);
      setOpen(false);
      if (!isEditing) form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Location" : "Add Location"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    Address
                    <FieldInfo hint="Street address including building number and floor" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street, Floor 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      City
                      <FieldInfo hint="City where this office is located" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      State / Province
                      <FieldInfo hint="State or province — leave blank if not applicable" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Country
                      <FieldInfo hint="Country where this office is located" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Postal Code
                      <FieldInfo hint="ZIP or postal code for this office location" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="00000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_headquarter"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="flex cursor-pointer items-center gap-1.5">
                    Set as Headquarters
                    <FieldInfo hint="Mark this as your company's primary office" />
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Add Location"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
