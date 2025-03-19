import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const OnboardingApplicant = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 2;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="px-36 py-12">
      <div className="flex gap-x-5 flex-col">
        <section className="flex-1">
          <div className="bg-white border border-neutral-300 rounded-lg w-full px-12 py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Applicant Form</h1>
              <p className="text-sm text-gray-500">
                Step {step + 1} of {totalSteps}
              </p>
            </div>

            <div className="mt-4">
              {step === 0 && (
                <>
                  <h1 className="font-semibold text-lg mb-4">Contact Information</h1>
                  <div className="mb-4">
                    <h2 className="font-semibold">Contact Number</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter your phone number (e.g., 123-456-7890)"
                    />
                  </div>
                  <div className="mb-4">
                    <h2 className="font-semibold">Email</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter your email (e.g., name@example.com)"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">Address</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter your full address"
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="font-semibold text-lg mb-4">Professional Information</h1>
                  <div className="mb-4">
                    <h2 className="font-semibold">Professional Title</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter your job title (e.g., Software Engineer)"
                    />
                  </div>
                  <div className="mb-4">
                    <h2 className="font-semibold">Work Type</h2>
                    <Select>
                      <SelectTrigger className="shadow-none w-1/3 h-10 bg-neutral-100/50">
                        <SelectValue placeholder="Select Job Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contractual">Contractual</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h2 className="font-semibold">Resume</h2>
                    <Button 
                      variant="outline" 
                      className="h-10 bg-neutral-100/50 border-neutral-300"
                    >
                      Upload Resume
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-end mt-5 gap-x-2">
          {step > 0 && (
            <Button 
              variant="outline"
              className="mb-3" 
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button 
            className="mb-3" 
            onClick={handleNext}
          >
            {step === totalSteps - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingApplicant;