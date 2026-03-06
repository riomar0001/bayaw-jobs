"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { ManageAdmins } from "@/components/company/dashboard/settings/admins/manage-admins";

export default function SettingsAdminsPage() {
  return (
    <>
      <PageHeader
        title="Manage Admins"
        description="Control who can access and manage your recruitment dashboard"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Settings" },
          { label: "Manage Admins" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ManageAdmins />
      </div>
    </>
  );
}
