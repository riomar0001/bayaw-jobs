import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User } from "lucide-react";

export interface ExperienceData {
  companyName: string;
  position: string;
  fromYear: string;
  toYear: string;
  currentlyWorking: boolean;
}

interface ExperienceFormProps {
  experiences: ExperienceData[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: keyof ExperienceData,
    value: string | boolean,
  ) => void;
}

export function ExperienceForm({
  experiences,
  onAdd,
  onRemove,
  onUpdate,
}: ExperienceFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experiences.map((exp, index) => (
        <Card key={index} className="border">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Experience #{index + 1}
              </span>
              {experiences.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Field>
              <FieldLabel htmlFor={`company-${index}`}>Company Name</FieldLabel>
              <Input
                id={`company-${index}`}
                type="text"
                placeholder="e.g. Google"
                value={exp.companyName}
                onChange={(e) => onUpdate(index, "companyName", e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`position-${index}`}>Position</FieldLabel>
              <Input
                id={`position-${index}`}
                type="text"
                placeholder="e.g. Software Engineer"
                value={exp.position}
                onChange={(e) => onUpdate(index, "position", e.target.value)}
                required
              />
            </Field>

            <div
              className={`grid ${exp.currentlyWorking ? "grid-cols-1" : "grid-cols-2"} gap-4`}
            >
              <div className="flex flex-col gap-2">
                <Field>
                  <FieldLabel htmlFor={`from-${index}`}>From Year</FieldLabel>
                  <Input
                    id={`from-${index}`}
                    type="number"
                    placeholder="e.g. 2020"
                    min="1950"
                    max="2030"
                    value={exp.fromYear}
                    onChange={(e) =>
                      onUpdate(index, "fromYear", e.target.value)
                    }
                    required
                  />
                </Field>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`currently-working-${index}`}
                    checked={exp.currentlyWorking}
                    onCheckedChange={(checked) =>
                      onUpdate(index, "currentlyWorking", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`currently-working-${index}`}
                    className="font-normal cursor-pointer"
                  >
                    Currently working here
                  </Label>
                </div>
              </div>

              {!exp.currentlyWorking && (
                <Field>
                  <FieldLabel htmlFor={`to-${index}`}>To Year</FieldLabel>
                  <Input
                    id={`to-${index}`}
                    type="number"
                    placeholder="e.g. 2023"
                    min="1950"
                    max="2030"
                    value={exp.toYear}
                    onChange={(e) => onUpdate(index, "toYear", e.target.value)}
                    required
                  />
                </Field>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
