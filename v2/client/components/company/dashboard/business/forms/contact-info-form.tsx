'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfile } from '@/types/business';
import { Loader2 } from 'lucide-react';
import { FieldInfo } from '@/components/company/dashboard/business/field-info';
import { businessService } from '@/api/services/business.service';
import { toast } from 'sonner';

const contactInfoSchema = z.object({
  company_id: z.string(),
  email: z.string().email('Invalid email address'),
  phone: z.string(),
});

type ContactInfoValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoFormProps {
  business: BusinessProfile;
}

export function ContactInfoForm({ business }: ContactInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactInfoValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      company_id: business.id,
      email: business.contact.email,
      phone: business.contact.phone,
    },
  });

  async function onSubmit(data: ContactInfoValues) {
    setIsSubmitting(true);
    try {
      await businessService.updateContact(data);
      toast.success('Contact information updated successfully');
    } catch {
      toast.error('Failed to update contact information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Email
                      <FieldInfo hint="Primary contact email for applicants and inquiries" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="careers@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Phone
                      <FieldInfo hint="Optional phone number for direct contact" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
