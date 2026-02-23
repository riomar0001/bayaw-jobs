"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { PasswordForm } from "@/components/company/dashboard/settings/security/password-form";
import { LoginHistory } from "@/components/company/dashboard/settings/security/login-history";

export default function SettingsSecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        description="Manage your password and account security"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Settings" },
          { label: "Security" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <PasswordForm />
        <LoginHistory />
      </div>
    </>
  );
}
