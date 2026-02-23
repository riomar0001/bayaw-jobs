"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressStepper } from "@/components/applicants/onboarding/progress-stepper";
import { PersonalInfoStep } from "@/components/applicants/onboarding/forms/personal-info-step";
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

interface OnboardingData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  desiredPosition: string;

  // Step 2: Background
  education: EducationData;
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
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    desiredPosition: "",
    education: {
      school: "",
      field: "",
      monthGraduated: "",
      yearGraduated: "",
    },
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
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Onboarding completed:", formData);
    // TODO: Submit to backend
    router.push("/");
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
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  age: formData.age,
                  gender: formData.gender,
                  desiredPosition: formData.desiredPosition,
                }}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />
            )}

            {/* Step 2: Background */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <EducationForm
                  data={formData.education}
                  onChange={(education) =>
                    setFormData({ ...formData, education })
                  }
                />

                <ExperienceForm
                  experiences={formData.experiences}
                  onAdd={addExperience}
                  onRemove={removeExperience}
                  onUpdate={updateExperience}
                />

                <SkillsForm
                  skills={formData.skills}
                  onChange={(skills) => setFormData({ ...formData, skills })}
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
                disabled={currentStep === 1}
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
                <Button type="button" onClick={handleSubmit}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
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
