"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/company/dashboard/layout/app-sidebar";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import CompanyNoAccessPage from "@/components/company/no-access";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, _hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;
  }, [_hasHydrated, isLoading, isAuthenticated, user, router]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && user?.company_id ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      ) : (
        <CompanyNoAccessPage />
      )}
    </>
  );
}
