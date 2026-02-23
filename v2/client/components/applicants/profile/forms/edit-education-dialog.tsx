"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const educationSchema = z.object({
  school: z.string().min(2, "School name is required"),
  field: z.string().min(2, "Field of study is required"),
  monthGraduated: z.string().min(1, "Month is required"),
  yearGraduated: z.string().min(4, "Year is required"),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EditEducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EducationFormData;
  onSave: (data: EducationFormData) => void;
}

export function EditEducationDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditEducationDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const monthGraduated = watch("monthGraduated");

  const onSubmit = async (data: EducationFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="school">School / University</Label>
            <Input
              id="school"
              placeholder="e.g. University of California"
              {...register("school")}
              className={errors.school ? "border-destructive" : ""}
            />
            {errors.school && (
              <p className="text-sm text-destructive">
                {errors.school.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              placeholder="e.g. Computer Science"
              {...register("field")}
              className={errors.field ? "border-destructive" : ""}
            />
            {errors.field && (
              <p className="text-sm text-destructive">{errors.field.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthGraduated">Month Graduated</Label>
              <Select
                value={monthGraduated}
                onValueChange={(value) => setValue("monthGraduated", value)}
              >
                <SelectTrigger
                  className={`${errors.monthGraduated ? "border-destructive" : ""} w-full`}
                >
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">January</SelectItem>
                  <SelectItem value="02">February</SelectItem>
                  <SelectItem value="03">March</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">May</SelectItem>
                  <SelectItem value="06">June</SelectItem>
                  <SelectItem value="07">July</SelectItem>
                  <SelectItem value="08">August</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
              {errors.monthGraduated && (
                <p className="text-sm text-destructive">
                  {errors.monthGraduated.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearGraduated">Year Graduated</Label>
              <Input
                id="yearGraduated"
                type="number"
                placeholder="e.g. 2020"
                min="1950"
                max="2030"
                {...register("yearGraduated")}
                className={errors.yearGraduated ? "border-destructive" : ""}
              />
              {errors.yearGraduated && (
                <p className="text-sm text-destructive">
                  {errors.yearGraduated.message}
                </p>
              )}
            </div>
          </div>

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
