"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { BusinessProfileForm } from "@/components/company/dashboard/business/forms/business-profile-form";
import { LocationManager } from "@/components/company/dashboard/business/location-manager";
import { getBusinessProfile } from "@/data";

export default function BusinessPage() {
  const business = getBusinessProfile();

  return (
    <>
      <PageHeader
        title="Business Profile"
        description="Manage your company information"
        breadcrumbs={[
          { label: "Dashboard", href: "/company" },
          { label: "Business Profile" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <BusinessProfileForm business={business} />
        <LocationManager locations={business.locations} />
      </div>
    </>
  );
}
