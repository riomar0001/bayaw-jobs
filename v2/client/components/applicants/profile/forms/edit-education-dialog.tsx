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
import { applicantService } from "@/api/services/applicant.service";
import { toast } from "sonner";

const educationItemSchema = z.object({
  id: z.string().optional(),
  school: z.string().min(2, "School name is required"),
  field: z.string().min(2, "Field of study is required"),
  fromYear: z.string().min(4, "From year is required"),
  toYear: z.string().min(4, "To year is required").optional(),
  currentlyEnrolled: z.boolean(),
});

const educationSchema = z.object({
  educations: z
    .array(educationItemSchema)
    .min(1, "At least one education is required"),
});

export type EducationItem = z.infer<typeof educationItemSchema>;
type EducationFormData = z.infer<typeof educationSchema>;

interface EditEducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EducationItem[];
  onSave: (data: EducationItem[]) => void;
}

export function EditEducationDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditEducationDialogProps) {
  const [educations, setEducations] = useState<EducationItem[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            school: "",
            field: "",
            fromYear: "",
            toYear: "",
            currentlyEnrolled: false,
          },
        ],
  );

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: { educations },
  });

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setEducations(
        initialData.length > 0
          ? initialData
          : [
              {
                school: "",
                field: "",
                fromYear: "",
                toYear: "",
                currentlyEnrolled: false,
              },
            ],
      );
    }
  }

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        school: "",
        field: "",
        fromYear: "",
        toYear: "",
        currentlyEnrolled: false,
      },
    ]);
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string | boolean,
  ) => {
    const newEducations = [...educations];
    newEducations[index] = { ...newEducations[index], [field]: value };
    setEducations(newEducations);
  };

  const onSubmit = async () => {
    try {
      const currentIds = educations.map((e) => e.id).filter(Boolean);
      const originalIds = initialData.map((e) => e.id).filter(Boolean);

      const toDelete = originalIds.filter((id) => !currentIds.includes(id));

      for (const id of toDelete) {
        if (id) await applicantService.deleteEducation(id);
      }

      const newSavedEducations: EducationItem[] = [];
      for (const edu of educations) {
        const payload = {
          institution_name: edu.school,
          field_of_study: edu.field,
          start_year: parseInt(edu.fromYear, 10),
          end_year: edu.currentlyEnrolled
            ? null
            : parseInt(edu.toYear || "0", 10),
        };

        if (edu.id) {
          const res = await applicantService.updateEducation(edu.id, payload);
          newSavedEducations.push({ ...edu, id: res.id });
        } else {
          const res = await applicantService.addEducation(payload);
          newSavedEducations.push({ ...edu, id: res.id });
        }
      }

      toast.success("Education updated successfully");
      onSave(newSavedEducations);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update education",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <Card key={index} className="border">
                <CardContent className="pt-3 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Education #{index + 1}
                    </span>
                    {educations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`school-${index}`}>
                      School / University
                    </Label>
                    <Input
                      id={`school-${index}`}
                      placeholder="e.g. University of California"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(index, "school", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}`}>Field of Study</Label>
                    <Input
                      id={`field-${index}`}
                      placeholder="e.g. Computer Science"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, "field", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`currently-enrolled-${index}`}
                      checked={edu.currentlyEnrolled}
                      onCheckedChange={(checked) =>
                        updateEducation(
                          index,
                          "currentlyEnrolled",
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`currently-enrolled-${index}`}
                      className="font-normal cursor-pointer"
                    >
                      Currently enrolled here
                    </Label>
                  </div>

                  <div
                    className={`grid ${edu.currentlyEnrolled ? "grid-cols-1" : "grid-cols-2"} gap-4`}
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`from-${index}`}>Start Year</Label>
                      <Input
                        id={`from-${index}`}
                        type="number"
                        placeholder="e.g. 2020"
                        min="1950"
                        max="2030"
                        value={edu.fromYear}
                        onChange={(e) =>
                          updateEducation(index, "fromYear", e.target.value)
                        }
                        required
                      />
                    </div>

                    {!edu.currentlyEnrolled && (
                      <div className="space-y-2">
                        <Label htmlFor={`to-${index}`}>End Year</Label>
                        <Input
                          id={`to-${index}`}
                          type="number"
                          placeholder="e.g. 2024"
                          min="1950"
                          max="2030"
                          value={edu.toYear || ""}
                          onChange={(e) =>
                            updateEducation(index, "toYear", e.target.value)
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
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Education
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
