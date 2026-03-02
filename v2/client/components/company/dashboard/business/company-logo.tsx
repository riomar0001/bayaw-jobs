"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyLogoProps {
  name: string;
  logo?: string;
}

export function CompanyLogo({ name, logo }: CompanyLogoProps) {
  const [preview, setPreview] = useState<string | undefined>(logo);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
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
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Camera className="size-3.5" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Click the camera icon to update your logo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
