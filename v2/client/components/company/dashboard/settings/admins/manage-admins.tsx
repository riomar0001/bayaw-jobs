"use client";

import { useState } from "react";
import { AdminUser, mockAdmins } from "@/data/mock-admins";
import { InviteDialog } from "./invite-dialog";
import { AdminsTable } from "./admins-table";

export function ManageAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);

  const activeCount = admins.filter((a) => a.status === "Active").length;
  const pendingCount = admins.filter((a) => a.status === "Pending").length;

  const handleRemove = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (id: string, data: Pick<AdminUser, "role" | "status">) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold mt-1">{admins.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {activeCount}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Invites</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Team Members
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage who has access to your company dashboard.
            </p>
          </div>
          <InviteDialog />
        </div>
        <div className="px-6 pb-6">
          <AdminsTable
            admins={admins}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}
