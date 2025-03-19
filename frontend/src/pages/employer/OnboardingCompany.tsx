import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const OnboardingCompany = () => {
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
              <h1 className="text-2xl font-bold mb-2">Company Form</h1>
              <p className="text-sm text-gray-500">
                Step {step + 1} of {totalSteps}
              </p>
            </div>

            <div className="mt-4">
              {step === 0 && (
                <>
                  <h1 className="font-semibold text-lg mb-4">Basic Information</h1>
                  <div className="mb-4">
                    <h2 className="font-semibold">Name</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter company name (e.g., xAI)"
                    />
                  </div>
                  <div className="mb-4">
                    <h2 className="font-semibold">Address</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter company address"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">Contact Number</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter contact number (e.g., 123-456-7890)"
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="font-semibold text-lg mb-4">Company Details</h1>
                  <div className="mb-4">
                    <h2 className="font-semibold">Description</h2>
                    <Textarea 
                      className="shadow-none bg-neutral-100/50 min-h-[100px]" 
                      placeholder="Enter company description (e.g., We build AI to accelerate human scientific discovery)"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">Type of Industry</h2>
                    <Input 
                      className="shadow-none h-10 bg-neutral-100/50" 
                      placeholder="Enter industry type (e.g., Technology)"
                    />
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

export default OnboardingCompany;