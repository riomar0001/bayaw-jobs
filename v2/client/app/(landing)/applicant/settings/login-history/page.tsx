"use client";

import { LoginHistoryTable } from "@/components/applicants/settings/login-history-table";

export default function SettingsLoginHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Login History</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review recent login sessions on your account.
        </p>
      </div>
      <hr className="border-border" />
      <LoginHistoryTable />
    </div>
  );
}
