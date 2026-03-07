'use client';

import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { ManageAdmins } from '@/components/company/dashboard/settings/admins/manage-admins';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { businessService, CompanyAdmin } from '@/api';
import { useEffect, useState } from 'react';

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

export default function SettingsAdminsPage() {
  const [admins, setAdmins] = useState<CompanyAdmin[]>([]);
  const [currentUserRights, setCurrentUserRights] = useState<CompanyAdmin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await businessService.getAdmins();
      setAdmins(result.admins);
      setCurrentUserRights(result.my_rights);
    } catch {
      setError('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdmins();
  }, []);

  return (
    <>
      <PageHeader
        title="Manage Admins"
        description="Control who can access and manage your recruitment dashboard"
        breadcrumbs={[
          { label: 'Dashboard', href: '/company' },
          { label: 'Settings' },
          { label: 'Manage Admins' },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && <FormLoadingSkeleton />}
        {error && <ErrorAlert message={error} onRetry={fetchAdmins} />}
        {!isLoading && !error && (
          <div className="p-6">
            <ManageAdmins
              admins={admins}
              currentUserRights={currentUserRights}
              onSuccess={fetchAdmins}
            />
          </div>
        )}
      </div>
    </>
  );
}
