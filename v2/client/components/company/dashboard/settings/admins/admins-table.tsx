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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AdminUser } from "@/data/mock-admins";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { roleConfig, statusColors } from "./admin-config";
import { EditMemberDialog } from "./edit-member-dialog";
import { RemoveDialog } from "./remove-dialog";

interface AdminsTableProps {
  admins: AdminUser[];
  onEdit: (id: string, data: Pick<AdminUser, "role" | "status">) => void;
  onRemove: (id: string) => void;
}

export function AdminsTable({ admins, onEdit, onRemove }: AdminsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
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
                      <p className="font-medium leading-none">{admin.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("gap-1", role.color)}
                  >
                    <RoleIcon className="size-3" />
                    {role.label}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(statusColors[admin.status])}
                  >
                    {admin.status}
                  </Badge>
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
                      {admin.status === "Pending" && (
                        <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                      )}
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
