"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Minus, MoreHorizontal } from "lucide-react";
import { AdminPermissions, AdminUser } from "@/data/mock-admins";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { roleConfig } from "./admin-config";
import { EditMemberDialog } from "./edit-member-dialog";
import { RemoveDialog } from "./remove-dialog";

interface AdminsTableProps {
  admins: AdminUser[];
  onEdit: (id: string, data: { position: string; permissions: AdminPermissions }) => void;
  onRemove: (id: string) => void;
}

const PERMISSIONS: { key: keyof AdminPermissions; label: string }[] = [
  { key: "canEdit", label: "Edit" },
  { key: "canDelete", label: "Delete" },
  { key: "canPostJob", label: "Post Jobs" },
];

export function AdminsTable({ admins, onEdit, onRemove }: AdminsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => {
            const role = roleConfig[admin.role];
            const RoleIcon = role.icon;
            const initials = admin.name
              .split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <TableRow key={admin.id}>
                {/* Member */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium leading-none">{admin.name}</p>
                        {admin.role === "Owner" && (
                          <Badge
                            variant="secondary"
                            className={cn("gap-1 text-xs", role.color)}
                          >
                            <RoleIcon className="size-3" />
                            {role.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Position */}
                <TableCell className="text-sm text-muted-foreground">
                  {admin.position}
                </TableCell>

                {/* Permissions */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {PERMISSIONS.map(({ key, label }) => {
                      const enabled = admin.permissions[key];
                      return (
                        <span
                          key={key}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            enabled
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground/50",
                          )}
                        >
                          {enabled ? (
                            <Check className="size-2.5" />
                          ) : (
                            <Minus className="size-2.5" />
                          )}
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </TableCell>

                {/* Joined */}
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(admin.joinedAt)}
                </TableCell>

                {/* Last active */}
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(admin.lastActive)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={admin.role === "Owner"}
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditMemberDialog admin={admin} onUpdate={onEdit} />
                      <DropdownMenuSeparator />
                      <RemoveDialog admin={admin} onRemove={onRemove} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
