'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Languages,
  ArrowLeft,
  Loader2,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { businessService } from '@/api/services/business.service';
import { BusinessApplicantDetail } from '@/api/types';
import { cn } from '@/lib/utils';

interface ApplicantDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  SCREENING: 'bg-yellow-100 text-yellow-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { id } = use(params);
  const [data, setData] = useState<BusinessApplicantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicant() {
      try {
        const result = await businessService.getApplicantByApplicationId(id);
        setData(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load applicant';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicant();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Applicant"
          breadcrumbs={[
            { label: 'Dashboard', href: '/company' },
            { label: 'Applicants', href: '/company/applicants' },
            { label: 'Loading...' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <PageHeader
          title="Applicant"
          breadcrumbs={[
            { label: 'Dashboard', href: '/company' },
            { label: 'Applicants', href: '/company/applicants' },
            { label: 'Error' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">{error || 'Applicant not found'}</p>
        </div>
      </>
    );
  }

  const { application, applicant } = data;
  const fullName = `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim() || 'Unknown';
  const initials = `${applicant.first_name?.[0] || ''}${applicant.last_name?.[0] || ''}` || '?';

  return (
    <>
      <PageHeader
        title={fullName}
        breadcrumbs={[
          { label: 'Dashboard', href: '/company' },
          { label: 'Applicants', href: '/company/applicants' },
          { label: fullName },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/company/applicants">
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>
            </Button>
            {applicant.email && (
              <Button asChild>
                <a href={`mailto:${applicant.email}`}>Send Email</a>
              </Button>
            )}
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <Avatar className="size-24">
                  <AvatarImage src={applicant.profile_picture_url ?? undefined} alt={fullName} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{fullName}</h2>
                  <p className="text-muted-foreground">{applicant.desired_position}</p>
                  <p className="text-sm text-muted-foreground">{applicant.location}</p>

                  {applicant.applicantSkills && applicant.applicantSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {applicant.applicantSkills.slice(0, 5).map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.skill_name}
                        </Badge>
                      ))}
                      {applicant.applicantSkills.length > 5 && (
                        <Badge variant="outline">
                          +{applicant.applicantSkills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-10 pt-4">
                  {/* Contact Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {applicant.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm">{applicant.email}</p>
                        </div>
                      </div>
                    )}
                    {applicant.phone_number && (
                      <div className="flex items-center gap-3">
                        <Phone className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm">{applicant.phone_number}</p>
                        </div>
                      </div>
                    )}
                    {applicant.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm">{applicant.location}</p>
                        </div>
                      </div>
                    )}
                    {applicant.gender && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Gender</p>
                          <p className="text-sm">{applicant.gender}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  {applicant.applicantLanguages && applicant.applicantLanguages.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Languages className="size-4" />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {applicant.applicantLanguages.map((lang) => (
                          <Badge key={lang.id} variant="outline">
                            {lang.language_name} - {lang.proficiency_level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {applicant.applicantSkills && applicant.applicantSkills.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Briefcase className="size-4" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {applicant.applicantSkills.map((skill) => (
                          <Badge key={skill.id} variant="outline">
                            {skill.skill_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="experience" className="space-y-4 pt-4">
                  {!applicant.applicantExperiences ||
                  applicant.applicantExperiences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No experience listed.</p>
                  ) : (
                    applicant.applicantExperiences.map((exp) => (
                      <div key={exp.id} className="flex gap-4 rounded-lg border p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <Briefcase className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.position}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="education" className="space-y-4 pt-4">
                  {!applicant.applicantEducations || applicant.applicantEducations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No education listed.</p>
                  ) : (
                    applicant.applicantEducations.map((edu) => (
                      <div key={edu.id} className="flex gap-4 rounded-lg border p-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{edu.field_of_study}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution_name}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {edu.start_year} - {edu.end_year || 'Present'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Applied Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/company/jobs/${application.job.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{application.job.title}</p>
                    <Badge
                      variant="secondary"
                      className={cn('text-xs', statusColors[application.status])}
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{application.job.department}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Applied: {new Date(application.application_date).toLocaleDateString()}
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Resume */}
            {applicant.resume_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 size-4" />
                      Download Resume
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
