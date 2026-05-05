"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refresh = useAuthStore((s) => s.refresh);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (user?.status === 'BANNED' && pathname !== '/banned') {
      router.replace('/banned');
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
