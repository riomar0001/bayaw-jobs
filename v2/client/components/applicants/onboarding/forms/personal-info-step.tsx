import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  desiredPosition: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="desiredPosition">Desired Position</FieldLabel>
        <Input
          id="desiredPosition"
          type="text"
          placeholder="e.g. Senior Frontend Developer"
          value={data.desiredPosition}
          onChange={(e) =>
            onChange({ ...data, desiredPosition: e.target.value })
          }
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="age">Age</FieldLabel>
        <Input
          id="age"
          type="number"
          placeholder="25"
          min="18"
          max="100"
          value={data.age}
          onChange={(e) => onChange({ ...data, age: e.target.value })}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Gender</FieldLabel>
        <RadioGroup
          value={data.gender}
          onValueChange={(value) => onChange({ ...data, gender: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="font-normal cursor-pointer">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="font-normal cursor-pointer">
              Female
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="font-normal cursor-pointer">
              Other
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
            <Label
              htmlFor="prefer-not-to-say"
              className="font-normal cursor-pointer"
            >
              Prefer not to say
            </Label>
          </div>
        </RadioGroup>
      </Field>
    </div>
  );
}
