"use client";

import { PasswordForm } from "@/components/applicants/settings/forms/password-form";

export default function SettingsPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update your password to keep your account secure.
        </p>
      </div>
      <hr className="border-border" />
      <PasswordForm />
    </div>
  );
}
