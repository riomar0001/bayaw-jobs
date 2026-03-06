"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ProgressStepper } from "@/components/applicants/onboarding/progress-stepper";
import {
  PersonalInfoStep,
  type PersonalInfoData,
} from "@/components/applicants/onboarding/forms/personal-info-step";
import {
  EducationForm,
  type EducationData,
} from "@/components/applicants/onboarding/forms/education-form";
import {
  ExperienceForm,
  type ExperienceData,
} from "@/components/applicants/onboarding/forms/experience-form";
import { SkillsForm } from "@/components/applicants/onboarding/forms/skills-form";
import {
  LanguagesForm,
  type LanguageData,
} from "@/components/applicants/onboarding/forms/languages-form";
import { ResumeUpload } from "@/components/applicants/onboarding/resume-upload";
import { applicantService } from "@/api/services/applicant.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/api/client";
import { toast } from "sonner";

interface OnboardingData {
  // Step 1: Personal Info
  age: string;
  gender: string;
  desiredPosition: string;
  location: string;
  countryCode: string;
  phoneNumber: string;

  // Step 2: Background
  educations: EducationData[];
  experiences: ExperienceData[];
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: "basic" | "conversational" | "fluent" | "native";
  }>;

  // Step 3: Documents
  resume: File | null;
}

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    age: "",
    gender: "",
    desiredPosition: "",
    location: "",
    countryCode: "+63",
    phoneNumber: "",
    educations: [],
    experiences: [
      {
        companyName: "",
        position: "",
        fromYear: "",
        toYear: "",
        currentlyWorking: false,
      },
    ],
    skills: [],
    languages: [],
    resume: null,
  });

  const handleNext = () => {
    if (currentStep === 1) {
      const {
        age,
        gender,
        desiredPosition,
        location,
        countryCode,
        phoneNumber,
      } = formData;
      if (
        !age ||
        !gender ||
        !desiredPosition ||
        !location ||
        !countryCode ||
        !phoneNumber
      ) {
        toast.error(
          "Please complete all personal information fields before continuing.",
        );
        return;
      }
      if (Number(age) < 16) {
        toast.error("You must be at least 16 years old.");
        return;
      }
    }

    if (currentStep === 2) {
      if (formData.skills.length === 0) {
        toast.error("Please add at least one skill before continuing.");
        return;
      }
      if (formData.languages.length === 0) {
        toast.error("Please add at least one language before continuing.");
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.resume) {
      toast.error("Please upload your resume (PDF) to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      await applicantService.completeOnboarding(
        {
          profile: {
            age: Number(formData.age),
            gender: formData.gender,
            desired_position: formData.desiredPosition,
            location: formData.location,
            phone_number: `${formData.countryCode} ${formData.phoneNumber.trim()}`,
          },
          education: formData.educations
            .filter((e) => e.school)
            .map((e) => ({
              institution_name: e.school,
              field_of_study: e.field,
              start_year: Number(e.yearGraduated) - 4,
              end_year: Number(e.yearGraduated) || null,
            })),
          experience: formData.experiences
            .filter((e) => e.companyName)
            .map((e) => ({
              company_name: e.companyName,
              position: e.position,
              start_date: `${e.fromYear}-01-01`,
              is_current: e.currentlyWorking,
              end_date: e.currentlyWorking ? null : `${e.toYear}-12-31`,
            })),
          skills: formData.skills,
          languages: formData.languages.map((l) => ({
            language_name: l.language,
            proficiency_level: l.proficiency.toUpperCase() as
              | "BASIC"
              | "CONVERSATIONAL"
              | "FLUENT"
              | "NATIVE",
          })),
        },
        formData.resume,
      );

      // Get a fresh token with applicant_profile_id embedded
      await refresh();
      router.replace("/applicant/profile");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          // Strip "body." prefix and convert dot-path to readable label
          const label = field
            .replace(/^body\./, "")
            .replace(/\./g, " → ")
            .replace(/_/g, " ");
          messages.forEach((msg) => toast.error(msg, { description: label }));
        });
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      educations: [
        ...formData.educations,
        {
          school: "",
          field: "",
          monthGraduated: "",
          yearGraduated: "",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducations = formData.educations.filter((_, i) => i !== index);
    setFormData({ ...formData, educations: newEducations });
  };

  const updateEducation = (
    index: number,
    field: keyof EducationData,
    value: string,
  ) => {
    const newEducations = [...formData.educations];
    newEducations[index] = { ...newEducations[index], [field]: value };
    setFormData({ ...formData, educations: newEducations });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        {
          companyName: "",
          position: "",
          fromYear: "",
          toYear: "",
          currentlyWorking: false,
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: newExperiences });
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceData,
    value: string | boolean,
  ) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setFormData({ ...formData, experiences: newExperiences });
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        {
          language: "",
          proficiency: "basic",
        },
      ],
    });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: newLanguages });
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageData,
    value: string,
  ) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setFormData({ ...formData, languages: newLanguages });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-12 px-4">
      {/* Background Decoration */}
      <div className="fixed top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Just a few more steps to get started with your job search
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Form Card */}
        <Card className="border">
          <CardHeader className="pb-4">
            <h2 className="text-2xl font-bold">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Educational Background"}
              {currentStep === 3 && "Upload Documents"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <PersonalInfoStep
                data={{
                  age: formData.age,
                  gender: formData.gender,
                  desiredPosition: formData.desiredPosition,
                  location: formData.location,
                  countryCode: formData.countryCode,
                  phoneNumber: formData.phoneNumber,
                }}
                onChange={(data: PersonalInfoData) =>
                  setFormData({ ...formData, ...data })
                }
              />
            )}

            {/* Step 2: Background */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <EducationForm
                  educations={formData.educations}
                  onAdd={addEducation}
                  onRemove={removeEducation}
                  onUpdate={updateEducation}
                />

                <ExperienceForm
                  experiences={formData.experiences}
                  onAdd={addExperience}
                  onRemove={removeExperience}
                  onUpdate={updateExperience}
                />

                <SkillsForm
                  skills={formData.skills}
                  onChange={(skills: string[]) =>
                    setFormData({ ...formData, skills })
                  }
                />

                <LanguagesForm
                  languages={formData.languages}
                  onAdd={addLanguage}
                  onRemove={removeLanguage}
                  onUpdate={updateLanguage}
                />
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <ResumeUpload
                file={formData.resume}
                onFileChange={(resume) => setFormData({ ...formData, resume })}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Submitting..." : "Complete"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}
