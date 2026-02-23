"use client";

import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Camera } from "lucide-react";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  desiredPosition?: string;
  status: "actively-looking" | "employed" | "open-to-opportunities";
}

const statusConfig = {
  "actively-looking": {
    label: "Actively Looking",
    variant: "default" as const,
  },
  employed: {
    label: "Employed",
    variant: "secondary" as const,
  },
  "open-to-opportunities": {
    label: "Open to Opportunities",
    variant: "outline" as const,
  },
};

export function ProfileHeader({
  firstName,
  lastName,
  email,
  phone,
  desiredPosition,
  status,
}: ProfileHeaderProps) {
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`;
  const statusInfo = statusConfig[status];

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar with edit overlay */}
          <div className="relative group flex-shrink-0">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              aria-label="Change profile picture"
            >
              <Camera className="h-5 w-5 text-white drop-shadow" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                // In a real app, handle upload here
                console.log("Selected file:", e.target.files?.[0]);
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold mb-1">{fullName}</h1>
                {desiredPosition && (
                  <p className="text-base text-primary font-medium mb-1">
                    {desiredPosition}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Bayaw Jobs - Job Seeker
                </p>
              </div>

              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              {phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
