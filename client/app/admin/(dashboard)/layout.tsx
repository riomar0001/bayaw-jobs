'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, _hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.replace('/login');
    }
  }, [_hasHydrated, isLoading, isAuthenticated, user, router]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
