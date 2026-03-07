'use client';

import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { ProfileForm } from '@/components/company/dashboard/settings/profile/profile-form';
import { ErrorAlert } from '@/components/common/error-alert';
import { useEffect, useState } from 'react';
import { businessService } from '@/api';
import { CompanyUser } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';

const FormLoadingSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
} 

export default function SettingsProfilePage() {
  const [data, setData] = useState<CompanyUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await businessService.getAdmins();
      const currentUser = result.my_rights;
      if (!currentUser) {
        throw new Error('Unable to find your profile');
      }
      setData({
        email: currentUser.user.email,
        first_name: currentUser.user.first_name,
        last_name: currentUser.user.last_name,
        profile_picture: currentUser.profile_picture_url,
        fullName: `${currentUser.user.first_name} ${currentUser.user.last_name}`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load profile data';
      setError(errorMsg);
      console.error('[SettingsProfilePage]', err);
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
        title="Profile Settings"
        description="Manage your account settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/company' },
          { label: 'Settings' },
          { label: 'Profile' },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <FormLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchData} />}
        {!isLoading && !error && data && (
          <div className="p-6">
            <ProfileForm user={data} />
          </div>
        )}
      </div>
    </>
  );
}
