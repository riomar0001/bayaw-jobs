"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { ProfileForm } from "@/components/company/dashboard/settings/profile/profile-form";
import { getCurrentUser } from "@/data";

export default function SettingsProfilePage() {
  const user = getCurrentUser();

  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Manage your account settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Settings" },
          { label: "Profile" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ProfileForm user={user} />
      </div>
    </>
  );
}
