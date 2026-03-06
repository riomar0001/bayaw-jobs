"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/applicants/profile/profile-header";
import { ProfileSectionCard } from "@/components/applicants/profile/profile-section-card";
import { ActiveApplicationsCard } from "@/components/applicants/profile/active-applications-card";
import { CareerStatusCard } from "@/components/applicants/profile/career-status-card";
import { EditPersonalInfoDialog } from "@/components/applicants/profile/forms/edit-personal-info-dialog";
import { EditEducationDialog } from "@/components/applicants/profile/forms/edit-education-dialog";
import { EditExperienceDialog } from "@/components/applicants/profile/forms/edit-experience-dialog";
import { EditResumeDialog } from "@/components/applicants/profile/forms/edit-resume-dialog";
import { EditSkillsDialog } from "@/components/applicants/profile/forms/edit-skills-dialog";
import { EditLanguagesDialog } from "@/components/applicants/profile/forms/edit-languages-dialog";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { mockUserProfile, type UserProfile } from "@/data";
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Cake,
  Download,
  ArrowLeft,
  Code,
  Languages,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(mockUserProfile);
  const [editPersonalInfoOpen, setEditPersonalInfoOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);
  const [editResumeOpen, setEditResumeOpen] = useState(false);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [editLanguagesOpen, setEditLanguagesOpen] = useState(false);

  const getMonthName = (month: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[parseInt(month) - 1];
  };

  const handleSavePersonalInfo = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
    location: string;
    desiredPosition: string;
  }) => {
    setProfile({
      ...profile,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      age: parseInt(data.age),
      gender: data.gender,
      desiredPosition: data.desiredPosition,
      personalInfo: {
        ...profile.personalInfo,
        firstName: data.firstName,
        lastName: data.lastName,
        age: parseInt(data.age),
        gender: data.gender,
      },
    });
  };

  const handleSaveEducation = (data: UserProfile["education"]) => {
    setProfile({
      ...profile,
      education: data,
    });
  };

  const handleSaveExperience = (data: UserProfile["experiences"]) => {
    setProfile({
      ...profile,
      experiences: data,
    });
  };

  const handleSaveResume = (data: UserProfile["resume"]) => {
    setProfile({
      ...profile,
      resume: data,
    });
  };

  const handleSaveSkills = (skills: string[]) => {
    setProfile({
      ...profile,
      skills,
    });
  };

  const handleSaveLanguages = (languages: UserProfile["languages"]) => {
    setProfile({
      ...profile,
      languages,
    });
  };

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
                firstName={profile.firstName}
                lastName={profile.lastName}
                email={profile.email}
                phone={profile.phone}
                desiredPosition={profile.desiredPosition}
                status={profile.status}
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
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Mail Address
                    </p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Phone Number
                    </p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Cake className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                    <p className="font-medium">
                      {profile.personalInfo.age} years old
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium capitalize">
                      {profile.personalInfo.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="font-medium">San Francisco, CA, USA</p>
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
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {profile.education.school}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Master degree in {profile.education.field}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getMonthName(profile.education.monthGraduated)}{" "}
                    {profile.education.yearGraduated}
                  </p>
                </div>
              </div>
            </ProfileSectionCard>

            {/* Work Experience */}
            <ProfileSectionCard
              title="All Experiences"
              icon={<Briefcase className="h-5 w-5 text-primary" />}
              onEdit={() => setEditExperienceOpen(true)}
            >
              <div className="space-y-6">
                {profile.experiences.map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold">{exp.companyName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exp.position}
                          </p>
                        </div>
                        {exp.currentlyWorking && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {exp.fromYear} -{" "}
                          {exp.currentlyWorking ? "Present" : exp.toYear}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSectionCard>

            {/* Resume */}
            <ProfileSectionCard
              title="Resume"
              icon={<FileText className="h-5 w-5 text-primary" />}
              onEdit={() => setEditResumeOpen(true)}
            >
              {profile.resume ? (
                <div className="flex flex-row items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      {profile.resume.fileName}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{profile.resume.fileSize}</span>
                    </div>
                  </div>

                  <button className="text-primary hover:underline text-sm font-medium">
                    Download
                  </button>
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
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ProfileSectionCard>

            {/* Languages */}
            <ProfileSectionCard
              title="Languages"
              icon={<Languages className="h-5 w-5 text-primary" />}
              onEdit={() => setEditLanguagesOpen(true)}
            >
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary/50 text-foreground rounded-full text-sm font-medium"
                  >
                    {lang.language} •{" "}
                    <span className="text-muted-foreground capitalize">
                      {lang.proficiency}
                    </span>
                  </span>
                ))}
              </div>
            </ProfileSectionCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Applications */}
            <ActiveApplicationsCard
              applications={profile.currentlyApplyingFor}
            />

            {/* Career Status */}
            <CareerStatusCard status={profile.status} />

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
                  <p className="font-medium text-sm">{profile.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Mail Address
                  </p>
                  <p className="font-medium text-sm">{profile.email}</p>
                </div>
              </div>
            </ProfileSectionCard>

            {/* Resume Sidebar */}
            <ProfileSectionCard
              title="Resume"
              icon={<FileText className="h-5 w-5 text-primary" />}
              hideEdit
            >
              {profile.resume && (
                <div className=" flex flex-row items-center justify-center gap-4 hover:bg-muted/50 transition-colors p-3 rounded-lg cursor-pointer">
                  <div className=" bg-linear-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center p-3 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium text-sm mb-1">
                    {profile.resume.fileName}
                  </p>
                  <button className="text-primary hover:underline text-xs ml-auto">
                    <Download className="h-4 w-4 text-primary" />
                  </button>
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
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          age: profile.age.toString(),
          gender: profile.gender as
            | "male"
            | "female"
            | "other"
            | "prefer-not-to-say",
          location: "San Francisco, CA, USA",
          desiredPosition: profile.desiredPosition,
        }}
        onSave={handleSavePersonalInfo}
      />

      <EditEducationDialog
        open={editEducationOpen}
        onOpenChange={setEditEducationOpen}
        initialData={profile.education}
        onSave={handleSaveEducation}
      />

      <EditExperienceDialog
        open={editExperienceOpen}
        onOpenChange={setEditExperienceOpen}
        initialData={profile.experiences}
        onSave={handleSaveExperience}
      />

      <EditResumeDialog
        open={editResumeOpen}
        onOpenChange={setEditResumeOpen}
        initialData={profile.resume}
        onSave={handleSaveResume}
      />

      <EditSkillsDialog
        open={editSkillsOpen}
        onOpenChange={setEditSkillsOpen}
        initialData={profile.skills}
        onSave={handleSaveSkills}
      />

      <EditLanguagesDialog
        open={editLanguagesOpen}
        onOpenChange={setEditLanguagesOpen}
        initialData={profile.languages}
        onSave={handleSaveLanguages}
      />

      <Footer />
    </main>
  );
}
