"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/applicants/profile/profile-header";
import { ProfileSectionCard } from "@/components/applicants/profile/profile-section-card";
import { CareerStatusCard } from "@/components/applicants/profile/career-status-card";
import { EditPersonalInfoDialog } from "@/components/applicants/profile/forms/edit-personal-info-dialog";
import { EditEducationDialog } from "@/components/applicants/profile/forms/edit-education-dialog";
import { EditExperienceDialog } from "@/components/applicants/profile/forms/edit-experience-dialog";
import { EditResumeDialog } from "@/components/applicants/profile/forms/edit-resume-dialog";
import { EditSkillsDialog } from "@/components/applicants/profile/forms/edit-skills-dialog";
import { EditLanguagesDialog } from "@/components/applicants/profile/forms/edit-languages-dialog";
import { Footer } from "@/components/shared/footer";
import { ActiveApplicationsCard } from "@/components/applicants/profile/active-applications-card";
import { Button } from "@/components/ui/button";
import { applicantService } from "@/api/services/applicant.service";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ApplicantProfile,
  CareerStatus,
  ProficiencyLevel,
} from "@/api/types";
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Phone,
  MapPin,
  Cake,
  Download,
  ArrowLeft,
  Code,
  Languages,
  Loader2,
} from "lucide-react";

type DisplayStatus = "actively-looking" | "employed" | "open-to-opportunities";

function mapCareerStatus(cs: CareerStatus | null | undefined): DisplayStatus {
  if (cs === "ACTIVELY_LOOKING") return "actively-looking";
  if (cs === "OPEN_TO_OPPORTUNITIES") return "open-to-opportunities";
  return "employed";
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localResume, setLocalResume] = useState<{
    fileName: string;
    fileSize: string;
    uploadedAt: string;
  } | null>(null);

  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);
  const [editResumeOpen, setEditResumeOpen] = useState(false);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [editLanguagesOpen, setEditLanguagesOpen] = useState(false);

  useEffect(() => {
    applicantService
      .getProfile()
      .then((data) => {
        setProfile(data);
        if (data.resume_url) {
          setLocalResume({
            fileName: "",
            fileSize: "",
            uploadedAt: data.created_at,
          });
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSavePersonalInfo = (data: {
    phone: string;
    age: string;
    gender: string;
    location: string;
    desiredPosition: string;
  }) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            phone_number: data.phone,
            age: parseInt(data.age),
            gender: data.gender,
            location: data.location,
            desired_position: data.desiredPosition,
          }
        : prev,
    );
  };

  const handleSaveEducation = (
    data: Array<{
      id?: string;
      school: string;
      field: string;
      fromYear: string;
      toYear?: string;
      currentlyEnrolled: boolean;
    }>,
  ) => {
    setProfile((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            applicantEducations: data.map((edu, i) => ({
              id:
                edu.id ?? prev.applicantEducations?.[i]?.id ?? `temp-edu-${i}`,
              applicant_profile_id: prev.id,
              institution_name: edu.school,
              field_of_study: edu.field,
              start_year: parseInt(edu.fromYear, 10),
              end_year: edu.currentlyEnrolled
                ? null
                : parseInt(edu.toYear || "0", 10),
            })),
          },
    );
  };

  const handleSaveExperience = (
    data: Array<{
      companyName: string;
      position: string;
      fromYear: string;
      toYear?: string;
      currentlyWorking: boolean;
    }>,
  ) => {
    setProfile((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            applicantExperiences: data.map((exp, i) => ({
              id: prev.applicantExperiences?.[i]?.id ?? `temp-${i}`,
              applicant_profile_id: prev.id,
              company_name: exp.companyName,
              position: exp.position,
              start_date: `${exp.fromYear}-01-01`,
              end_date: exp.currentlyWorking
                ? null
                : exp.toYear
                  ? `${exp.toYear}-12-31`
                  : null,
              is_current: exp.currentlyWorking,
            })),
          },
    );
  };

  const handleSaveResume = (
    data: { fileName: string; fileSize: string; uploadedAt: string } | null,
  ) => {
    setLocalResume(data);
  };

  const handleSaveSkills = (
    skills: Array<{ id?: string; skill_name: string }>,
  ) => {
    setProfile((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            applicantSkills: skills.map((s, i) => ({
              id: s.id ?? prev.applicantSkills?.[i]?.id ?? `temp-skill-${i}`,
              skill_name: s.skill_name,
            })),
          },
    );
  };

  const handleSaveLanguages = (
    languages: Array<{
      language: string;
      proficiency: "basic" | "conversational" | "fluent" | "native";
    }>,
  ) => {
    setProfile((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            applicantLanguages: languages.map((lang, i) => ({
              id: prev.applicantLanguages?.[i]?.id ?? `temp-lang-${i}`,
              applicant_profile_id: prev.id,
              language_name: lang.language,
              proficiency_level:
                lang.proficiency.toUpperCase() as ProficiencyLevel,
            })),
          },
    );
  };

  const displayStatus = mapCareerStatus(profile?.career_status);
  const resumeFileName = `${user?.first_name ?? ""}-${user?.last_name ?? ""}-resume.pdf`;
  const displayResume =
    (localResume ??
    (profile?.resume_url
      ? { fileName: "", fileSize: "", uploadedAt: "" }
      : null))
      ? {
          ...(localResume ?? { fileName: "", fileSize: "", uploadedAt: "" }),
          fileName: resumeFileName,
        }
      : null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error ?? "Profile not found."}</p>
        <Button variant="ghost" onClick={() => router.back()}>
          Go Back
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Return
          </Button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="mb-6">
              <ProfileHeader
                firstName={user?.first_name ?? ""}
                lastName={user?.last_name ?? ""}
                email={user?.email ?? ""}
                phone={profile.phone_number}
                desiredPosition={profile.desired_position}
                status={displayStatus}
                profilePictureUrl={profile.profile_picture_url}
              />
            </div>

            {/* Personal Information */}
            <ProfileSectionCard
              title="All Personal Informations"
              icon={<User className="h-5 w-5 text-primary" />}
              onEdit={() => setEditPersonalInfoOpen(true)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Phone Number
                    </p>
                    <p className="font-medium">{profile.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Cake className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                    <p className="font-medium">{profile.age} years old</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium capitalize">{profile.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="font-medium">{profile.location}</p>
                  </div>
                </div>
              </div>
            </ProfileSectionCard>

            {/* Education */}
            <ProfileSectionCard
              title="Education"
              icon={<GraduationCap className="h-5 w-5 text-primary" />}
              onEdit={() => setEditEducationOpen(true)}
            >
              {(profile.applicantEducations ?? []).length > 0 ? (
                <div className="space-y-4">
                  {(profile.applicantEducations ?? []).map((edu, index) => (
                    <div key={edu.id || index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <GraduationCap className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {edu.institution_name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {edu.field_of_study}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.start_year} – {edu.end_year ?? "Present"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No education added yet.
                </p>
              )}
            </ProfileSectionCard>

            {/* Work Experience */}
            <ProfileSectionCard
              title="All Experiences"
              icon={<Briefcase className="h-5 w-5 text-primary" />}
              onEdit={() => setEditExperienceOpen(true)}
            >
              {(profile.applicantExperiences ?? []).length > 0 ? (
                <div className="space-y-6">
                  {(profile.applicantExperiences ?? []).map((exp, index) => (
                    <div key={exp.id || index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Briefcase className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-semibold">
                              {exp.company_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {exp.position}
                            </p>
                          </div>
                          {exp.is_current && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(exp.start_date).getFullYear()} –{" "}
                            {exp.is_current
                              ? "Present"
                              : exp.end_date
                                ? new Date(exp.end_date).getFullYear()
                                : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No experience added yet.
                </p>
              )}
            </ProfileSectionCard>

            {/* Resume */}
            <ProfileSectionCard
              title="Resume"
              icon={<FileText className="h-5 w-5 text-primary" />}
              onEdit={() => setEditResumeOpen(true)}
            >
              {displayResume ? (
                <div className="flex flex-row items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      {displayResume.fileName}
                    </p>
                    {displayResume.fileSize && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{displayResume.fileSize}</span>
                      </div>
                    )}
                  </div>
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Download
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No resume uploaded yet.
                </p>
              )}
            </ProfileSectionCard>

            {/* Skills */}
            <ProfileSectionCard
              title="Skills"
              icon={<Code className="h-5 w-5 text-primary" />}
              onEdit={() => setEditSkillsOpen(true)}
            >
              {(profile.applicantSkills ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(profile.applicantSkills ?? []).map((skill, index) => (
                    <span
                      key={skill.id || index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills added yet.
                </p>
              )}
            </ProfileSectionCard>

            {/* Languages */}
            <ProfileSectionCard
              title="Languages"
              icon={<Languages className="h-5 w-5 text-primary" />}
              onEdit={() => setEditLanguagesOpen(true)}
            >
              {(profile.applicantLanguages ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(profile.applicantLanguages ?? []).map((lang, index) => (
                    <span
                      key={lang.id || index}
                      className="px-3 py-1.5 bg-secondary/50 text-foreground rounded-full text-sm font-medium"
                    >
                      {lang.language_name} •{" "}
                      <span className="text-muted-foreground capitalize">
                        {lang.proficiency_level.toLowerCase()}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No languages added yet.
                </p>
              )}
            </ProfileSectionCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Applications */}
            <ActiveApplicationsCard />

            {/* Career Status */}
            <CareerStatusCard status={displayStatus} />

            {/* Personal Information Sidebar */}
            <ProfileSectionCard
              title="Personal Informations"
              icon={<User className="h-5 w-5 text-primary" />}
              hideEdit
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Phone Number
                  </p>
                  <p className="font-medium text-sm">{profile.phone_number}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Mail Address
                  </p>
                  <p className="font-medium text-sm">{user?.email ?? ""}</p>
                </div>
              </div>
            </ProfileSectionCard>

            {/* Resume Sidebar */}
            <ProfileSectionCard
              title="Resume"
              icon={<FileText className="h-5 w-5 text-primary" />}
              hideEdit
            >
              {displayResume && (
                <div className="flex flex-row items-center justify-center gap-4 hover:bg-muted/50 transition-colors p-3 rounded-lg cursor-pointer">
                  <div className="bg-linear-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center p-3 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium text-sm mb-1">
                    {displayResume.fileName}
                  </p>
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto"
                    >
                      <Download className="h-4 w-4 text-primary" />
                    </a>
                  )}
                </div>
              )}
            </ProfileSectionCard>
          </div>
        </div>
      </div>

      {/* Edit Dialogs */}
      <EditPersonalInfoDialog
        open={editPersonalInfoOpen}
        onOpenChange={setEditPersonalInfoOpen}
        initialData={{
          phone: profile.phone_number,
          age: profile.age.toString(),
          gender: profile.gender as
            | "male"
            | "female"
            | "other"
            | "prefer-not-to-say",
          location: profile.location,
          desiredPosition: profile.desired_position,
        }}
        onSave={handleSavePersonalInfo}
      />

      <EditEducationDialog
        open={editEducationOpen}
        onOpenChange={setEditEducationOpen}
        initialData={(profile.applicantEducations ?? []).map((edu) => ({
          id: edu.id,
          school: edu.institution_name,
          field: edu.field_of_study,
          fromYear: String(edu.start_year),
          toYear: edu.end_year ? String(edu.end_year) : undefined,
          currentlyEnrolled: !edu.end_year,
        }))}
        onSave={handleSaveEducation}
      />

      <EditExperienceDialog
        open={editExperienceOpen}
        onOpenChange={setEditExperienceOpen}
        initialData={(profile.applicantExperiences ?? []).map((exp) => ({
          id: exp.id,
          companyName: exp.company_name,
          position: exp.position,
          fromYear: String(new Date(exp.start_date).getFullYear()),
          toYear: exp.end_date
            ? String(new Date(exp.end_date).getFullYear())
            : undefined,
          currentlyWorking: exp.is_current,
        }))}
        onSave={handleSaveExperience}
      />

      <EditResumeDialog
        open={editResumeOpen}
        onOpenChange={setEditResumeOpen}
        initialData={displayResume}
        onSave={handleSaveResume}
      />

      <EditSkillsDialog
        open={editSkillsOpen}
        onOpenChange={setEditSkillsOpen}
        initialData={(profile.applicantSkills ?? []).map((s) => ({
          id: s.id,
          skill_name: s.skill_name,
        }))}
        onSave={handleSaveSkills}
      />

      <EditLanguagesDialog
        open={editLanguagesOpen}
        onOpenChange={setEditLanguagesOpen}
        initialData={(profile.applicantLanguages ?? []).map((lang) => ({
          id: lang.id,
          language: lang.language_name,
          proficiency: lang.proficiency_level.toLowerCase() as
            | "basic"
            | "conversational"
            | "fluent"
            | "native",
        }))}
        onSave={handleSaveLanguages}
      />

      <Footer />
    </main>
  );
}
