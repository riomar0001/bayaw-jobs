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
import { X, Plus, Loader2 } from "lucide-react";
import { applicantService } from "@/api/services/applicant.service";
import { toast } from "sonner";

export type SkillItem = { id?: string; skill_name: string };

interface EditSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: SkillItem[];
  onSave: (skills: SkillItem[]) => void;
}

export function EditSkillsDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditSkillsDialogProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialData);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSkills(initialData);
      setNewSkill("");
    }
  }, [open, initialData]);

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !skills.some(
        (s) => s.skill_name.toLowerCase() === newSkill.trim().toLowerCase(),
      )
    ) {
      setSkills([...skills, { skill_name: newSkill.trim() }]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const currentIds = skills.map((s) => s.id).filter(Boolean);
      const originalIds = initialData.map((s) => s.id).filter(Boolean);
      const toDelete = originalIds.filter((id) => !currentIds.includes(id));

      for (const id of toDelete) {
        if (id) await applicantService.deleteSkill(id);
      }

      const toAdd = skills.filter((s) => !s.id).map((s) => s.skill_name);
      let finalSkills = skills.filter((s) => s.id);

      if (toAdd.length > 0) {
        const newApiSkills = await applicantService.addSkills(toAdd);
        finalSkills = newApiSkills.map((s) => ({
          id: s.id,
          skill_name: s.skill_name,
        }));
      }

      toast.success("Skills updated successfully");
      onSave(finalSkills);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update skills",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSkills(initialData);
    setNewSkill("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skill">Add Skill</Label>
            <div className="flex gap-2">
              <Input
                id="skill"
                type="text"
                placeholder="e.g. React, TypeScript, Project Management"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <Label className="mb-3 block">Your Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill.skill_name}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
