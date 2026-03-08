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
import { businessService } from '@/api';
import { toast } from 'sonner';

const urlValidator = z
  .string()
  .optional()
  .refine((val) => !val || z.string().url().safeParse(val).success, 'Invalid URL');

const socialLinksSchema = z.object({
  facebook: urlValidator,
  twitter: urlValidator,
  linkedin: urlValidator,
  instagram: urlValidator,
});

type SocialLinksValues = z.infer<typeof socialLinksSchema>;

interface SocialLinksFormProps {
  business: BusinessProfile;
}

export function SocialLinksForm({ business }: SocialLinksFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SocialLinksValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: business.social_links?.facebook || '',
      twitter: business.social_links?.twitter || '',
      linkedin: business.social_links?.linkedin || '',
      instagram: business.social_links?.instagram || '',
    },
  });

  async function onSubmit(data: SocialLinksValues) {
    setIsSubmitting(true);
    try {
      await businessService.updateSocials({
        facebook: data.facebook || undefined,
        linkedin: data.linkedin || undefined,
        twitter: data.twitter || undefined,
        instagram: data.instagram || undefined,
      });
      
      toast.success('Social links updated successfully');
    } catch {
      toast.error('Failed to update social links. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Facebook
                      <FieldInfo hint="Your company's Facebook page URL" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/yourcompany" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Twitter
                      <FieldInfo hint="Your company's Twitter/X profile URL" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/yourcompany" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      LinkedIn
                      <FieldInfo hint="Your company's LinkedIn company page URL" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Instagram
                      <FieldInfo hint="Your company's Instagram profile URL" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourcompany" {...field} />
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
