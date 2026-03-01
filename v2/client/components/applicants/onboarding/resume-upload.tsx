"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      onFileChange(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel>Resume / CV</FieldLabel>
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
          {file ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onFileChange(null)}
              >
                Remove
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
                  PDF only (Max 10MB)
                </p>
              </div>
              <Input
                id="resume"
                type="file"
                accept=".pdf"
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
      </Field>
    </div>
  );
}
