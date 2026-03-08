"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Plus } from "lucide-react";
import { applicantService } from "@/api/services/applicant.service";
import { toast } from "sonner";
import { type ProficiencyLevel } from "@/api/types";

type LanguageData = {
  id?: string;
  language: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
};

interface EditLanguagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: LanguageData[];
  onSave: (languages: LanguageData[]) => void;
}

const proficiencyLevels = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

export function EditLanguagesDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditLanguagesDialogProps) {
  const [languages, setLanguages] = useState<LanguageData[]>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLanguages(initialData);
    }
  }, [open, initialData]);

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "basic" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageData,
    value: string,
  ) => {
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setLanguages(newLanguages);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const validLanguages = languages.filter(
        (lang) => lang.language.trim() !== "",
      );

      const currentIds = validLanguages.map((l) => l.id).filter(Boolean);
      const originalIds = initialData.map((l) => l.id).filter(Boolean);
      const toDelete = originalIds.filter((id) => !currentIds.includes(id));

      for (const id of toDelete) {
        if (id) await applicantService.deleteLanguage(id);
      }

      const newSavedLanguages: LanguageData[] = [];
      for (const lang of validLanguages) {
        const payload = {
          language_name: lang.language,
          // Server accepts uppercase
          proficiency_level: lang.proficiency.toUpperCase() as ProficiencyLevel,
        };
        if (lang.id) {
          const res = await applicantService.updateLanguage(lang.id, payload);
          newSavedLanguages.push({
            ...lang,
            id: res.id,
            proficiency:
              res.proficiency_level.toLowerCase() as LanguageData["proficiency"],
          });
        } else {
          const res = await applicantService.addLanguage(payload);
          newSavedLanguages.push({
            ...lang,
            id: res.id,
            proficiency:
              res.proficiency_level.toLowerCase() as LanguageData["proficiency"],
          });
        }
      }

      toast.success("Languages updated successfully");
      onSave(newSavedLanguages);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update languages",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLanguages(initialData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Languages</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add languages you speak and your proficiency level
            </p>
            <Button
              type="button"
              onClick={addLanguage}
              variant="outline"
              size="sm"
            >
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
                  <div className="space-y-2">
                    <Label htmlFor={`language-${index}`}>Language</Label>
                    <Input
                      id={`language-${index}`}
                      type="text"
                      placeholder="e.g. English, Spanish"
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, "language", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) =>
                        updateLanguage(
                          index,
                          "proficiency",
                          value as LanguageData["proficiency"],
                        )
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
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLanguage(index)}
                  className="text-destructive hover:text-destructive mt-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {languages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No languages added yet. Click &quot;Add Language&quot; to get
              started.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
