"use client";

import { useState, useRef, useEffect } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { COUNTRY_CODES } from "@/constants/country-codes";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FlagComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

function FlagIcon({ iso, className }: { iso: string; className?: string }) {
  const Flag = (Flags as Record<string, FlagComponent>)[iso];
  if (!Flag) return null;
  return <Flag className={className} />;
}

export interface PersonalInfoData {
  age: string;
  gender: string;
  desiredPosition: string;
  location: string;
  countryCode: string;
  phoneNumber: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  const [search, setSearch] = useState("");

  const selectedCountry = COUNTRY_CODES.find(
    (c) => c.code === data.countryCode,
  );

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search),
  );

  const searchRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Restore focus to search input whenever dropdown opens or search changes.
  // Radix Select's internal typeahead steals focus on every re-render.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [isOpen, search]);

  return (
    <div className="space-y-6">
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
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <Input
          id="location"
          type="text"
          placeholder="e.g. Makati City, Metro Manila"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Phone Number</FieldLabel>
        <div className="flex gap-2">
          <Select
            value={data.countryCode}
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) setSearch("");
            }}
            onValueChange={(value) => onChange({ ...data, countryCode: value })}
          >
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue placeholder="+code">
                {selectedCountry && (
                  <span className="flex items-center gap-2">
                    <FlagIcon
                      iso={selectedCountry.iso}
                      className="h-4 w-6 rounded-sm object-cover"
                    />
                    <span>{selectedCountry.code}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              avoidCollisions={false}
              className="w-72 p-0"
            >
              <div className="px-2 pt-2 pb-1 border-b">
                <Input
                  ref={searchRef}
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {filtered.map((c) => (
                  <SelectItem key={`${c.iso}-${c.code}`} value={c.code}>
                    <span className="flex items-center gap-2">
                      <FlagIcon
                        iso={c.iso}
                        className="h-4 w-6 rounded-sm object-cover shrink-0"
                      />
                      <span className="text-muted-foreground">{c.code}</span>
                      <span className="truncate">{c.label}</span>
                    </span>
                  </SelectItem>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No results
                  </p>
                )}
              </div>
            </SelectContent>
          </Select>

          <Input
            id="phoneNumber"
            type="tel"
            placeholder="912 345 6789"
            value={data.phoneNumber}
            onChange={(e) =>
              onChange({
                ...data,
                phoneNumber: e.target.value.replace(/\D/g, ""),
              })
            }
            required
            className="flex-1"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="age">Age</FieldLabel>
        <Input
          id="age"
          type="number"
          placeholder="25"
          min="16"
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
