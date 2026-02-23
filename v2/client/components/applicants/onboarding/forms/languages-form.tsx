"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

export interface LanguageData {
  language: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

interface LanguagesFormProps {
  languages: LanguageData[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof LanguageData, value: string) => void;
}

const proficiencyLevels = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

export function LanguagesForm({
  languages,
  onAdd,
  onRemove,
  onUpdate,
}: LanguagesFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Languages</h3>
          <p className="text-sm text-muted-foreground">
            Add languages you speak and your proficiency level
          </p>
        </div>
        <Button type="button" onClick={onAdd} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="flex gap-4 items-start p-4 border rounded-lg"
          >
            <div className="flex-1 grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor={`language-${index}`}>Language</FieldLabel>
                <Input
                  id={`language-${index}`}
                  type="text"
                  placeholder="e.g. English, Spanish"
                  value={lang.language}
                  onChange={(e) => onUpdate(index, "language", e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={`proficiency-${index}`}>
                  Proficiency
                </FieldLabel>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) =>
                    onUpdate(index, "proficiency", value)
                  }
                >
                  <SelectTrigger id={`proficiency-${index}`}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {languages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No languages added yet. Click &quot;Add Language&quot; to get started.
        </p>
      )}
    </div>
  );
}
