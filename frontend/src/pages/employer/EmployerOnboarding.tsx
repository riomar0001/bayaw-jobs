import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/customs/employer/Spinner";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { Textarea } from "@/components/ui/textarea";

const EmployerOnboarding = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const navigate = useNavigate();
  const { authStateCompany } = useAuth();


  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(
          "/api/company/industries",
          {
            withCredentials: true,
          }
        );

        setIndustries(response.data.industries);
      } catch (error) {
        console.error("Failed to fetch industries", error);
      }
    };

    fetchIndustries();
  }, []);

  const handleIndustryChange = (value: any) => {
    console.log(value === "other");

    setValue("industry", value);
    setIsOtherSelected(value === "other");
  };

  const compressImage = (imageFile: any) => {
    return new Promise((resolve, reject) => {
      new Compressor(imageFile, {
        quality: 0.6, // Compress to 60% quality
        maxWidth: 1920, // Optional: resize image to fit max width
        success: (compressedResult) => resolve(compressedResult),
        error: (error) => reject(error),
      });
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const logo = data.logo[0];

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

    if (logo && logo.size > MAX_FILE_SIZE) {
      toast.error("File size too large", {
        description: "Please upload an image with a maximum size of 10MB.",
        classNames: {
          icon: "text-red-800",
          title: "text-red-800",
          description: "text-red-800",
          success: "bg-teal-100",
        },
      });
      return;
    }

    try {
      const formData = new FormData();
      const compressedLogo = await compressImage(data.logo[0]);

      console.log(isOtherSelected);

      formData.append("address", data.address);
      formData.append("contact_no", data.contact_no);
      formData.append("email", data.email);
      formData.append(
        "industry_name",
        isOtherSelected ? data.otherIndustry : data.industry
      );
      formData.append("logo", compressedLogo as any);

      await axios.post(
        "/api/company/onboarding",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // If needed for credentials
        }
      );

      toast.success("Success! 🎉", {
        description: "Onboarding process completed successfully.",
        classNames: {
          icon: "text-teal-800",
          title: "text-teal-800",
          description: "text-teal-800",
          success: "bg-teal-100",
        },
      });
      window.location.reload();
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg =
        error.response?.data?.errors?.[0]?.msg ??
        error.response?.data?.message ??
        error.response?.data?.error ??
        "An unexpected error occurred while processing your request. Please try again later or contact support if the issue persists.";

      toast.error("Oops! Failed to register.", {
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
    if (authStateCompany?.user_type === "company") {
      authStateCompany?.done_onboarding
        ? navigate("/employer/jobs")
        : navigate("/employer/onboarding");
    }
  }, [authStateCompany, navigate]);

  return (
    <div className="bg-neutral-100 w-full h-screen flex justify-center items-center">
      <div className="flex justify-center">
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <h1 className="font-normal text-3xl mb-10">Finish Setting Up Your Account</h1>
              <div className="sm:col-span-2">
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  {...register("logo", { required: "Company logo is required" })}
                />
                {errors.logo && (
                  <p className="text-red-400 text-sm">{errors.logo.message?.toString() || "This field is required"}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Company Name</Label>
                <Input
                  id="address"
                  placeholder="Company Name"
                  {...register("name", {
                    required: "Company Name is required"
                  })}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name.message?.toString() || "This field is required"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Company Address</Label>
                <Input
                  id="address"
                  placeholder="Company Address"
                  {...register("address", {
                    required: "Company address is required"
                  })}
                />
                {errors.address && (
                  <p className="text-red-400 text-sm">{errors.address.message?.toString() || "This field is required"}</p>
                )}
              </div>


              <div className="sm:col-span-2">
                <Label htmlFor="address">Company Description</Label>
                <Textarea
                  id="address"
                  placeholder="Company Description"
                  {...register("description", {
                    required: "Company description is required"
                  })}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description.message?.toString() || "This field is required"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="contact_no">Company Contact Number</Label>
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
                  <p className="text-red-400 text-sm">{errors.contact_no.message?.toString() || "This field is required"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">Company Email Address</Label>
                <Input
                  id="email"
                  placeholder="company@example.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message?.toString() || "This field is required"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="industry">Company Industry</Label>
                <Select onValueChange={handleIndustryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Industries</SelectLabel>
                      {industries.map((industry: any) => (
                        <SelectItem
                          key={industry.id}
                          value={industry.name}
                        >
                          {industry.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isOtherSelected && (
                  <div className="mt-2">
                    <Input
                      id="otherIndustry"
                      placeholder="Enter your industry"
                      {...register("otherIndustry", { required: isOtherSelected && "Please specify your industry" })}
                    />
                    {errors.otherIndustry && (
                      <p className="text-red-400 text-sm">{errors.otherIndustry.message?.toString()}</p>
                    )}
                  </div>
                )}
              </div>


            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>

            <Dialog open={isLoading}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Completing Your Account</DialogTitle>
                  <DialogDescription className="py-2 flex flex-col gap-x-2 gap-y-3 justify-center items-center">
                    Please wait while we process your request.
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

export default EmployerOnboarding;