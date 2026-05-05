"use client";

import { OtpToggle } from "@/components/shared/otp-toggle";

export default function ApplicantSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your login security preferences.
        </p>
      </div>
      <hr className="border-border" />
      <OtpToggle />
    </div>
  );
}
