'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CURRENCIES } from '@/constants/currencies';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job, JobStatus, EmploymentType, LocationType } from '@/api/types';
import { jobsService } from '@/api/services/jobs.service';
import { toast } from 'sonner';
import { ChevronDown, Loader2 } from 'lucide-react';

export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  location_type: z.enum(['ONSITE', 'REMOTE', 'HYBRID']),
  employment_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERN']),
  minimum_salary: z.string(),
  maximum_salary: z.string(),
  currency: z.string(),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.string(),
  qualifications: z.string(),
  benefits: z.string().optional(),
  status: z.enum(['OPEN', 'PAUSED', 'CLOSED']),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  job?: Job;
  mode: 'create' | 'edit';
  onSuccess?: () => void | Promise<void>;
}

export function JobForm({ job, mode, onSuccess }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<'publish' | 'draft'>('publish');

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: job
      ? {
          title: job.title,
          department: job.department,
          location: job.location,
          location_type: job.location_type,
          employment_type: job.employment_type,
          minimum_salary: job.minimum_salary,
          maximum_salary: job.maximum_salary,
          currency: job.currency,
          description: job.description,
          responsibilities: job.responsibilities.join('\n'),
          qualifications: job.qualifications.join('\n'),
          benefits: job.benefits.join('\n'),
          status: job.status,
        }
      : {
          title: '',
          department: '',
          location: '',
          location_type: 'HYBRID' as LocationType,
          employment_type: 'FULL_TIME' as EmploymentType,
          minimum_salary: '0',
          maximum_salary: '0',
          currency: 'USD',
          description: '',
          responsibilities: '',
          qualifications: '',
          benefits: '',
          status: 'OPEN' as JobStatus,
        },
  });

  // Sync status from props when it changes (e.g., from parent's status update dropdown)
  useEffect(() => {
    if (job?.status && job.status !== form.getValues('status')) {
      form.setValue('status', job.status);
    }
  }, [job?.status, form]);

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        department: data.department,
        location: data.location,
        location_type: data.location_type,
        employment_type: data.employment_type,
        minimum_salary: data.minimum_salary,
        maximum_salary: data.maximum_salary,
        currency: data.currency,
        description: data.description,
        responsibilities: data.responsibilities.split('\n').filter(Boolean),
        qualifications: data.qualifications.split('\n').filter(Boolean),
        benefits: (data.benefits || '').split('\n').filter(Boolean),
        status: data.status,
      };

      if (mode === 'create') {
        await jobsService.createJob(payload);
        toast.success('Job created successfully');
      } else if (job) {
        await jobsService.updateJob(job.id, payload);
        toast.success('Job updated successfully');
      }

      if (onSuccess) {
        await onSuccess();
      }
      router.push('/company/jobs');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save job';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Istanbul, Turkey" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REMOTE">Remote</SelectItem>
                        <SelectItem value="ONSITE">Onsite</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full-time</SelectItem>
                        <SelectItem value="PART_TIME">Part-time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                        <SelectItem value="INTERN">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="minimum_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maximum_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      className="min-h-37.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter each responsibility on a new line..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>One responsibility per line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter each qualification on a new line..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>One qualification per line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter each benefit on a new line..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>One benefit per line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          {mode === 'create' ? (
            <div className="flex">
              <Button
                type="submit"
                className="rounded-r-none"
                disabled={isSubmitting}
                onClick={() => {
                  setPendingAction('publish');
                  form.setValue('status', 'OPEN');
                }}
              >
                {isSubmitting && pendingAction === 'publish' && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Publish Job
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className="rounded-l-none border-l border-l-primary-foreground/25 px-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && pendingAction === 'draft' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Publishing Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setPendingAction('draft');
                      form.setValue('status', 'PAUSED');
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    Save as Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
