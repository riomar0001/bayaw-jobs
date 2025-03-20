import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/customs/employer/Spinner";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { Textarea } from "@/components/ui/textarea";

const ApplicantOnboarding = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [workTypes, setWorkTypes] = useState([
    { id: "FullTime", label: "Full Time" },
    { id: "PartTime", label: "Part Time" },
    { id: "Contractual", label: "Contract" },
    { id: "Freelance", label: "Freelance" },
    { id: "Internship", label: "Internship" }
  ]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { authStateApplicant } = useAuth();

  const handleWorkTypeChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkTypes([...selectedWorkTypes, id]);
    } else {
      setSelectedWorkTypes(selectedWorkTypes.filter(type => type !== id));
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const resume = data.resume[0];
    
    // Check if resume is a PDF
    if (resume && resume.type !== 'application/pdf') {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file for your resume.",
        classNames: {
          icon: "text-red-800",
          title: "text-red-800",
          description: "text-red-800",
          error: "bg-teal-100",
        },
      });
      setIsLoading(false);
      return;
    }

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (resume && resume.size > MAX_FILE_SIZE) {
      toast.error("File size too large", {
        description: "Please upload a resume with a maximum size of 10MB.",
        classNames: {
          icon: "text-red-800",
          title: "text-red-800",
          description: "text-red-800",
          error: "bg-teal-100",
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("contact_no", data.contact_no);
      
      if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
      if (data.address) formData.append("address", data.address);
      if (data.professional_title) formData.append("professional_title", data.professional_title);
      if (data.website) formData.append("website", data.website);
      
      // Append each selected work type
      selectedWorkTypes.forEach(type => {
        formData.append("work_type", type);
      });
      
      formData.append("resume", resume);

      const response = await axios.post(
        "/api/applicant/onboarding",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update local storage after successful onboarding
      let authStateApplicant = localStorage.getItem('authStateApplicant')
        ? JSON.parse(localStorage.getItem('authStateApplicant') as string)
        : null;

      if (authStateApplicant) {
        authStateApplicant.done_onboarding = true;
        localStorage.setItem('authStateApplicant', JSON.stringify(authStateApplicant));
      }

      toast.success("Success! 🎉", {
        description: "Onboarding process completed successfully.",
        classNames: {
          icon: "text-teal-800",
          title: "text-teal-800",
          description: "text-teal-800",
          success: "bg-teal-100",
        },
      });
      navigate("/applicant/profile");
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg =
        error.response?.data?.message ??
        error.response?.data?.error ??
        "An unexpected error occurred. Please try again later.";

      toast.error("Onboarding failed", {
        description: errorMsg,
        classNames: {
          icon: "text-red-800",
          title: "text-red-800",
          description: "text-red-800",
          error: "bg-teal-100",
        },
      });
    }
  };

  useEffect(() => {
    if (authStateApplicant?.user_type === "applicant") {
      authStateApplicant?.done_onboarding
        ? navigate("/applicant/profile")
        : navigate("/applicant/onboarding");
    }
  }, [authStateApplicant, navigate]);

  return (
    <div className="bg-neutral-100 w-full min-h-screen flex justify-center items-center py-8">
      <div className="flex justify-center">
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="font-normal text-3xl mb-10">Complete Your Profile</h1>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Personal Information */}
              <div>
                <Label htmlFor="first_name">First Name*</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  {...register("first_name", {
                    required: "First name is required"
                  })}
                />
                {errors.first_name && (
                  <p className="text-red-400 text-sm">{errors.first_name.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name*</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  {...register("last_name", {
                    required: "Last name is required"
                  })}
                />
                {errors.last_name && (
                  <p className="text-red-400 text-sm">{errors.last_name.message?.toString()}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="contact_no">Contact Number*</Label>
                <Input
                  id="contact_no"
                  placeholder="09123456789"
                  maxLength={11}
                  minLength={11}
                  {...register("contact_no", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: "Please enter a valid 11-digit phone number"
                    }
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                />
                {errors.contact_no && (
                  <p className="text-red-400 text-sm">{errors.contact_no.message?.toString()}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Your full address"
                  {...register("address")}
                />
              </div>

              {/* Professional Information */}
              <div className="sm:col-span-2">
                <Label htmlFor="professional_title">Professional Title</Label>
                <Input
                  id="professional_title"
                  placeholder="e.g. Full Stack Developer, UX Designer"
                  {...register("professional_title")}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="website">Personal Website/Portfolio URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  {...register("website")}
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Preferred Work Types</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {workTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`work-type-${type.id}`} 
                        onCheckedChange={(checked) => handleWorkTypeChange(type.id, checked === true)}
                      />
                      <label htmlFor={`work-type-${type.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="resume">Resume/CV (PDF only)*</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  {...register("resume", { required: "Resume is required" })}
                />
                {errors.resume && (
                  <p className="text-red-400 text-sm">{errors.resume.message?.toString()}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Profile"}
            </Button>

            <Dialog open={isLoading}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Completing Your Profile</DialogTitle>
                  <DialogDescription className="py-2 flex flex-col gap-x-2 gap-y-3 justify-center items-center">
                    Please wait while we process your information.
                    <Spinner />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantOnboarding;