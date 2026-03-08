import { Progress } from "@/components/ui/progress";
import { CheckCircle, User, GraduationCap, FileText } from "lucide-react";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({
  currentStep,
  totalSteps,
}: ProgressStepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: "Personal Info", icon: User },
    { number: 2, label: "Background", icon: GraduationCap },
    { number: 3, label: "Documents", icon: FileText },
  ];

  return (
    <div>
      <div className="flex justify-between mb-3">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep >= step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div
              key={step.number}
              className={`flex items-center gap-2 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
