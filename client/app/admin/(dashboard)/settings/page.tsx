"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { PasswordForm } from "@/components/company/dashboard/settings/security/password-form";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Change the password for your admin account"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <PasswordForm />
      </div>
    </>
  );
}
