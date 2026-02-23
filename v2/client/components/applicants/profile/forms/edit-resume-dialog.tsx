"use client";

import { useState } from "react";
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
import { Upload, FileText } from "lucide-react";

interface ResumeData {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

interface EditResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ResumeData | null;
  onSave: (data: ResumeData | null) => void;
}

export function EditResumeDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditResumeDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const resumeData: ResumeData = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString().split("T")[0],
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(resumeData);
    } else if (!initialData) {
      onSave(null);
    }

    onOpenChange(false);
  };

  const handleRemove = () => {
    setFile(null);
    onSave(null);
    onOpenChange(false);
  };

  const displayFile = file || initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`border border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {displayFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {file ? file.name : initialData?.fileName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : initialData?.fileSize}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label htmlFor="resume">
                  <Button type="button" variant="outline" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </Label>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {initialData && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                className="mr-auto"
              >
                Remove Resume
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
