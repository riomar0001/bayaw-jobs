"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export interface EducationData {
  school: string;
  field: string;
  monthGraduated: string;
  yearGraduated: string;
}

interface EducationFormProps {
  educations: EducationData[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof EducationData, value: string) => void;
}

export function EducationForm({
  educations,
  onAdd,
  onRemove,
  onUpdate,
}: EducationFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No education entries yet. Click &quot;Add Education&quot; to add one.
        </p>
      )}

      {educations.map((edu, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 relative">
          {educations.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-destructive hover:text-destructive"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <p className="text-sm font-medium text-muted-foreground">
            Education #{index + 1}
          </p>

          <Field>
            <FieldLabel htmlFor={`school-${index}`}>
              School / University
            </FieldLabel>
            <Input
              id={`school-${index}`}
              type="text"
              placeholder="e.g. University of California"
              value={edu.school}
              onChange={(e) => onUpdate(index, "school", e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`field-${index}`}>Field of Study</FieldLabel>
            <Input
              id={`field-${index}`}
              type="text"
              placeholder="e.g. Computer Science"
              value={edu.field}
              onChange={(e) => onUpdate(index, "field", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor={`monthGraduated-${index}`}>
                Month Graduated
              </FieldLabel>
              <Select
                value={edu.monthGraduated}
                onValueChange={(value) =>
                  onUpdate(index, "monthGraduated", value)
                }
              >
                <SelectTrigger>
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
            </Field>

            <Field>
              <FieldLabel htmlFor={`yearGraduated-${index}`}>
                Year Graduated
              </FieldLabel>
              <Input
                id={`yearGraduated-${index}`}
                type="number"
                placeholder="e.g. 2020"
                min="1950"
                max="2030"
                value={edu.yearGraduated}
                onChange={(e) =>
                  onUpdate(index, "yearGraduated", e.target.value)
                }
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}
