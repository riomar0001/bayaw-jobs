'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Pencil, MapPin, Building2, Clock, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { JobStatusBadge } from '@/components/company/dashboard/jobs/job-status-badge';
import { JobApplicantsTable } from '@/components/company/dashboard/jobs/job-applicants-table';
import { ErrorAlert } from '@/components/common/error-alert';
import { jobsService } from '@/api/services/jobs.service';
import { businessService } from '@/api/services/business.service';
import { JobWithApplicants, ApplicationStatus } from '@/api/types';
import { formatSalaryRange } from '@/lib/formatters';
import { toast } from 'sonner';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

function JobDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params);
  const [job, setJob] = useState<JobWithApplicants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await jobsService.getCompanyJob(id);
      setJob(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load job details';
      setError(errorMsg);
      console.error('[JobDetailPage]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchJob();
  }, [id]);

  const handleStatusUpdate = useCallback(
    async (applicationId: string, status: ApplicationStatus) => {
      try {
        await businessService.updateApplicationStatus(applicationId, status);
        setJob((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            applicant_applied_job: prev.applicant_applied_job.map((app) =>
              app.id === applicationId ? { ...app, status } : app,
            ),
          };
        });
        toast.success(`Application status updated to ${status}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update status';
        toast.error(message);
      }
    },
    [],
  );

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Loading..."
          breadcrumbs={[
            { label: 'Dashboard', href: '/company' },
            { label: 'Jobs', href: '/company/jobs' },
            { label: '...' },
          ]}
        />
        <JobDetailSkeleton />
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <PageHeader
          title="Job Not Found"
          breadcrumbs={[
            { label: 'Dashboard', href: '/company' },
            { label: 'Jobs', href: '/company/jobs' },
            { label: 'Error' },
          ]}
        />
        <div className="p-6">
          <ErrorAlert message={error ?? 'Job not found'} onRetry={fetchJob} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={job.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/company' },
          { label: 'Jobs', href: '/company/jobs' },
          { label: job.title },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Job Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CardTitle>{job.title}</CardTitle>
                  <JobStatusBadge status={job.status} />
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/company/jobs/${id}/edit`}>
                    <Pencil className="mr-2 size-4" />
                    Edit Job
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Info */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{job.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">
                      {job.employment_type} • {job.location_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm font-medium">
                      {formatSalaryRange(
                        Number(job.minimum_salary),
                        Number(job.maximum_salary),
                        job.currency,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="mb-2 font-semibold">Responsibilities</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="mb-2 font-semibold">Requirements</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {job.qualifications.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="mb-2 font-semibold">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, i) => (
                    <Badge key={i} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Tab */}
          <Card>
            <CardHeader>
              <CardTitle>Applicants ({job.applicant_applied_job.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <JobApplicantsTable
                applications={job.applicant_applied_job}
                onStatusUpdate={handleStatusUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
