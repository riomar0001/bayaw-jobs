"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <>{children}</>;
}
