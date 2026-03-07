"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { businessService } from "@/api";
import { toast } from "sonner";

interface CompanyLogoProps {
  name: string;
  logo?: string;
  onSuccess?: () => void | Promise<void>;
}

export function CompanyLogo({ name, logo, onSuccess }: CompanyLogoProps) {
  const [preview, setPreview] = useState<string | undefined>(logo);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Show preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setIsUploading(true);
    try {
      const result = await businessService.updateLogo(file);
      
      // Update preview with server URL
      setPreview(result.url);
      toast.success("Logo updated successfully");

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      // Revert preview on error
      setPreview(logo);
      console.error("Failed to upload logo:", err);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setIsUploading(false);
      // Clean up local URL
      URL.revokeObjectURL(localUrl);
    }
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="flex items-center gap-5 pt-6">
        <div className="relative">
          <Avatar className="size-20">
            <AvatarImage src={preview} alt={name} />
            <AvatarFallback className="text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Camera className="size-3.5" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isUploading
              ? "Uploading logo..."
              : "Click the camera icon to update your logo"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}