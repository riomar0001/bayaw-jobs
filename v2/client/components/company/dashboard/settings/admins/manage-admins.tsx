'use client';

import { useState } from 'react';
import { CompanyAdmin, AddAdminInput } from '@/api/types';
import { businessService } from '@/api';
import { InviteDialog } from './invite-dialog';
import { AdminsTable } from './admins-table';
import { toast } from 'sonner';

interface ManageAdminsProps {
  admins?: CompanyAdmin[];
  currentUserRights?: CompanyAdmin | null;
  onSuccess?: () => void | Promise<void>;
}

export function ManageAdmins({ admins = [], currentUserRights, onSuccess }: ManageAdminsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Count based on created_at (all returned admins are active)
  const totalCount = admins.length;

  // Check if current user has full rights to manage admins
  const canManageAdmins = currentUserRights?.can_create && currentUserRights?.can_delete;

  const handleAdd = async (data: Omit<AddAdminInput, 'can_read'>) => {
    try {
      setIsSubmitting(true);
      await businessService.addAdmin({
        ...data,
        can_read: true, // Always allow read
      });
      toast.success('Admin added successfully');
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add admin';
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (adminId: string) => {
    try {
      setIsSubmitting(true);
      await businessService.removeAdmin(adminId);
      toast.success('Admin removed successfully');
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove admin';
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold mt-1">{totalCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{totalCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Your Permissions</p>
          <p className="text-sm font-medium mt-1">{canManageAdmins ? 'Full Access' : 'Limited'}</p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Team Members</h3>
            <p className="text-sm text-muted-foreground">
              Manage who has access to your company dashboard.
            </p>
          </div>
          {canManageAdmins && <InviteDialog onAdd={handleAdd} isSubmitting={isSubmitting} />}
        </div>
        <div className="px-6 pb-6">
          <AdminsTable
            admins={admins}
            currentUserId={currentUserRights?.user_id}
            canManage={canManageAdmins ?? false}
            onRemove={handleRemove}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
