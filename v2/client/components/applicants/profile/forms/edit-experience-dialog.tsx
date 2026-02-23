"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const experienceItemSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  fromYear: z.string().min(4, "From year is required"),
  toYear: z.string().min(4, "To year is required").optional(),
  currentlyWorking: z.boolean(),
});

const experienceSchema = z.object({
  experiences: z
    .array(experienceItemSchema)
    .min(1, "At least one experience is required"),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;
type ExperienceItem = z.infer<typeof experienceItemSchema>;

interface EditExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ExperienceItem[];
  onSave: (data: ExperienceItem[]) => void;
}

export function EditExperienceDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditExperienceDialogProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialData);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { experiences: initialData },
  });

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        companyName: "",
        position: "",
        fromYear: "",
        toYear: "",
        currentlyWorking: false,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string | boolean,
  ) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setExperiences(newExperiences);
  };

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(experiences);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Experience</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <Card key={index} className="border">
                <CardContent className="pt-3 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Experience #{index + 1}
                    </span>
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Company Name</Label>
                    <Input
                      id={`company-${index}`}
                      placeholder="e.g. Google"
                      value={exp.companyName}
                      onChange={(e) =>
                        updateExperience(index, "companyName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`position-${index}`}>Position</Label>
                    <Input
                      id={`position-${index}`}
                      placeholder="e.g. Software Engineer"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`currently-working-${index}`}
                      checked={exp.currentlyWorking}
                      onCheckedChange={(checked) =>
                        updateExperience(
                          index,
                          "currentlyWorking",
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`currently-working-${index}`}
                      className="font-normal cursor-pointer"
                    >
                      Currently working here
                    </Label>
                  </div>

                  <div
                    className={`grid ${exp.currentlyWorking ? "grid-cols-1" : "grid-cols-2"} gap-4`}
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`from-${index}`}>From Year</Label>
                      <Input
                        id={`from-${index}`}
                        type="number"
                        placeholder="e.g. 2020"
                        min="1950"
                        max="2030"
                        value={exp.fromYear}
                        onChange={(e) =>
                          updateExperience(index, "fromYear", e.target.value)
                        }
                        required
                      />
                    </div>

                    {!exp.currentlyWorking && (
                      <div className="space-y-2">
                        <Label htmlFor={`to-${index}`}>To Year</Label>
                        <Input
                          id={`to-${index}`}
                          type="number"
                          placeholder="e.g. 2023"
                          min="1950"
                          max="2030"
                          value={exp.toYear || ""}
                          onChange={(e) =>
                            updateExperience(index, "toYear", e.target.value)
                          }
                          required
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Experience
          </Button>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
