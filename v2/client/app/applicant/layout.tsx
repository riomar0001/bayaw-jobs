"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Navbar } from "@/components/applicants/navbar";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, _hasHydrated, user } = useAuthStore();

  const isSettingsPath = pathname.startsWith("/applicant/settings");
  const isOnboardingPath = pathname === "/applicant/onboarding";

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!user?.applicant_profile_id && !isSettingsPath && !isOnboardingPath) {
      router.replace("/applicant/onboarding");
    }
  }, [_hasHydrated, isLoading, isAuthenticated, user, isSettingsPath, isOnboardingPath, router]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!user?.applicant_profile_id && !isSettingsPath && !isOnboardingPath) return null;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
