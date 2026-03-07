"use client";

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Camera } from "lucide-react";
import type { CareerStatus } from "@/api/types";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  desiredPosition?: string;
  status: CareerStatus;
  profilePictureUrl?: string | null;
}

const STATUS_CONFIG: Record<CareerStatus, { label: string; className: string }> = {
  ACTIVELY_LOOKING: {
    label: "Actively Looking",
    className: "bg-green-100 text-green-700",
  },
  OPEN_TO_OPPORTUNITIES: {
    label: "Open to Opportunities",
    className: "bg-blue-100 text-blue-700",
  },
  EMPLOYED_NOT_LOOKING: {
    label: "Employed",
    className: "bg-yellow-100 text-yellow-700",
  },
  NOT_LOOKING: {
    label: "Not Looking",
    className: "bg-slate-100 text-slate-600",
  },
};

export function ProfileHeader({
  firstName,
  lastName,
  email,
  phone,
  desiredPosition,
  status,
  profilePictureUrl,
}: ProfileHeaderProps) {
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0]}${lastName[0]}`;
  const statusInfo = STATUS_CONFIG[status];

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar with edit overlay */}
          <div className="relative group shrink-0">
            <Avatar className="h-20 w-20 border-2 border-border">
              {profilePictureUrl && (
                <AvatarImage src={profilePictureUrl} alt={fullName} />
              )}
              <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-sky-500 to-cyan-600 text-white">
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
              </div>

              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
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
