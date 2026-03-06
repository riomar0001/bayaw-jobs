"use client";

import { InformationForm } from "@/components/applicants/settings/forms/information-form";

export default function SettingsInformationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Account Information</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update your account details.
        </p>
      </div>
      <hr className="border-border" />
      <InformationForm />
    </div>
  );
}
