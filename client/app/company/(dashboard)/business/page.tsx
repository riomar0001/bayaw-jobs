'use client';

import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { CompanyLogo } from '@/components/company/dashboard/business/company-logo';
import { CompanyInfoForm } from '@/components/company/dashboard/business/forms/company-info-form';
import { ContactInfoForm } from '@/components/company/dashboard/business/forms/contact-info-form';
import { SocialLinksForm } from '@/components/company/dashboard/business/forms/social-links-form';
import { LocationManager } from '@/components/company/dashboard/business/location-manager';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { CompanyInfo } from '@/api/types';
import { businessService } from '@/api/services/business.service';

const FormLoadingSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

export default function BusinessPage() {
  const [data, setData] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await businessService.getInfo();

      setData(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load business data';
      setError(errorMsg);
      console.error('[useBusinessData]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);
  
  return (
    <>
      <PageHeader
        title="Business Profile"
        description="Manage your company information"
        breadcrumbs={[{ label: 'Dashboard', href: '/company' }, { label: 'Business Profile' }]}
      />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <FormLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchData} />}
        {!isLoading && !error && data && (
          <>
            <div className="p-6">
              <CompanyLogo name={data.company_name} logo={data.logo_url} />
            </div>
            <div className="px-6">
              <CompanyInfoForm business={data} />
            </div>
            <div className="px-6">
              <ContactInfoForm business={data} />
            </div>
            <div className="px-6">
              <SocialLinksForm business={data} />
            </div>
            <div className="px-6 pb-6">
              <LocationManager locations={data.locations || []} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
