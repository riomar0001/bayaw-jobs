"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Languages,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCandidateById,
  getApplicationsByCandidateId,
  mockJobs,
} from "@/data";
import { cn } from "@/lib/utils";

interface ApplicantDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interview: "bg-purple-100 text-purple-800",
  Offer: "bg-green-100 text-green-800",
  Hired: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ApplicantDetailPage({
  params,
}: ApplicantDetailPageProps) {
  const { id } = use(params);
  const candidate = getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const applications = getApplicationsByCandidateId(id).map((app) => ({
    ...app,
    job: mockJobs.find((j) => j.id === app.jobId),
  }));

  return (
    <>
      <PageHeader
        title={candidate.fullName}
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Applicants", href: "/company/applicants" },
          { label: candidate.fullName },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/company/applicants">
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>
            </Button>
            <Button>Send Email</Button>
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
                  <AvatarImage
                    src={candidate.profilePhoto}
                    alt={candidate.fullName}
                  />
                  <AvatarFallback className="text-2xl">
                    {candidate.firstName[0]}
                    {candidate.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{candidate.fullName}</h2>
                  <p className="text-muted-foreground">{candidate.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.company}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                    {candidate.skills.length > 5 && (
                      <Badge variant="outline">
                        +{candidate.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
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
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">
                          {candidate.personalInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">
                          {candidate.personalInfo.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm">
                          {candidate.personalInfo.locations.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Salary Expectation
                        </p>
                        <p className="text-sm">
                          {candidate.personalInfo.currency}
                          {candidate.personalInfo.salaryExpectation.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold">
                      <Languages className="size-4" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages.map((lang) => (
                        <Badge key={lang.id} variant="outline">
                          {lang.name} - {lang.proficiency}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold">
                      <Briefcase className="size-4" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4 pt-4">
                  {candidate.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Briefcase className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exp.companyName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{exp.employmentType}</span>
                          <span>•</span>
                          <span>{exp.duration}</span>
                          <span>•</span>
                          <span>
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="education" className="space-y-4 pt-4">
                  {candidate.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.institutionName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{edu.date}</span>
                          {edu.location && (
                            <>
                              <span>•</span>
                              <span>{edu.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Applied Positions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applications found.
                  </p>
                ) : (
                  applications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/company/jobs/${app.jobId}`}
                      className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{app.job?.title}</p>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", statusColors[app.status])}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {app.job?.department}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Resume */}
            {candidate.resume && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Download Resume
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
