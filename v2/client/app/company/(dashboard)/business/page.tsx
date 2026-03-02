"use client";

import { PageHeader } from "@/components/company/dashboard/layout/page-header";
import { CompanyLogo } from "@/components/company/dashboard/business/company-logo";
import { CompanyInfoForm } from "@/components/company/dashboard/business/forms/company-info-form";
import { ContactInfoForm } from "@/components/company/dashboard/business/forms/contact-info-form";
import { SocialLinksForm } from "@/components/company/dashboard/business/forms/social-links-form";
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
        <CompanyLogo name={business.name} logo={business.logo} />
        <CompanyInfoForm business={business} />
        <ContactInfoForm business={business} />
        <SocialLinksForm business={business} />
        <LocationManager locations={business.locations} />
      </div>
    </>
  );
}
