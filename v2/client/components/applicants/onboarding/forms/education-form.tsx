import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

export interface EducationData {
  school: string;
  field: string;
  monthGraduated: string;
  yearGraduated: string;
}

interface EducationFormProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Education</h3>
      </div>

      <Field>
        <FieldLabel htmlFor="school">School / University</FieldLabel>
        <Input
          id="school"
          type="text"
          placeholder="e.g. University of California"
          value={data.school}
          onChange={(e) => onChange({ ...data, school: e.target.value })}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="field">Field of Study</FieldLabel>
        <Input
          id="field"
          type="text"
          placeholder="e.g. Computer Science"
          value={data.field}
          onChange={(e) => onChange({ ...data, field: e.target.value })}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="monthGraduated">Month Graduated</FieldLabel>
          <Select
            value={data.monthGraduated}
            onValueChange={(value) =>
              onChange({ ...data, monthGraduated: value })
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
          <FieldLabel htmlFor="yearGraduated">Year Graduated</FieldLabel>
          <Input
            id="yearGraduated"
            type="number"
            placeholder="e.g. 2020"
            min="1950"
            max="2030"
            value={data.yearGraduated}
            onChange={(e) =>
              onChange({ ...data, yearGraduated: e.target.value })
            }
            required
          />
        </Field>
      </div>
    </div>
  );
}
