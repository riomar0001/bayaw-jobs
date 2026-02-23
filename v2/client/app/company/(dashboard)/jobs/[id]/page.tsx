"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pencil,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Users,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobStatusBadge } from "@/components/company/dashboard/jobs/job-status-badge";
import { JobApplicantsTable } from "@/components/company/dashboard/jobs/job-applicants-table";
import { getJobById, getApplicationsByJobId, mockCandidates } from "@/data";
import { formatSalaryRange, formatDate } from "@/lib/formatters";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params);
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const applications = getApplicationsByJobId(id).map((app) => ({
    ...app,
    candidate: mockCandidates.find((c) => c.id === app.candidateId),
  }));

  return (
    <>
      <PageHeader
        title={job.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Jobs", href: "/company/jobs" },
          { label: job.title },
        ]}
        actions={
          <Button asChild>
            <Link href={`/company/jobs/${id}/edit`}>
              <Pencil className="mr-2 size-4" />
              Edit Job
            </Link>
          </Button>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Job Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                  </div>
                  <JobStatusBadge status={job.status} />
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
                      <p className="text-xs text-muted-foreground">
                        Department
                      </p>
                      <p className="text-sm font-medium">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium">
                        {job.employmentType} • {job.locationType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="text-sm font-medium">
                        {formatSalaryRange(
                          job.salaryRange.min,
                          job.salaryRange.max,
                          job.salaryRange.currency,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
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
                    {job.requirements.map((req, i) => (
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
                <CardTitle>Applicants ({applications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <JobApplicantsTable applications={applications} />
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm">Applicants</span>
                  </div>
                  <span className="font-semibold">{job.applicantCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-muted-foreground" />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="font-semibold">{job.viewCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posted</span>
                  <span className="text-sm">{formatDate(job.createdAt)}</span>
                </div>
                {job.closingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Closes
                    </span>
                    <span className="text-sm">
                      {formatDate(job.closingDate)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
