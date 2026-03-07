'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Minus, MoreHorizontal } from 'lucide-react';
import { CompanyAdmin } from '@/api/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { roleConfig } from './admin-config';
import { RemoveDialog } from './remove-dialog';

interface AdminsTableProps {
  admins: CompanyAdmin[];
  currentUserId?: string;
  canManage: boolean;
  onRemove: (id: string) => void;
  isSubmitting?: boolean;
}

const PERMISSIONS: {
  key: keyof Pick<CompanyAdmin, 'can_create' | 'can_update' | 'can_delete'>;
  label: string;
}[] = [
  { key: 'can_update', label: 'Edit' },
  { key: 'can_delete', label: 'Delete' },
  { key: 'can_create', label: 'Create' },
];

export function AdminsTable({
  admins,
  currentUserId,
  canManage,
  onRemove,
  isSubmitting,
}: AdminsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Joined</TableHead>
            {canManage && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={canManage ? 5 : 4}
                className="text-center py-8 text-muted-foreground"
              >
                No team members found
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => {
              const roleKey = admin.role.toUpperCase();
              const role = roleConfig[roleKey] || roleConfig.ADMIN;
              const RoleIcon = role.icon;
              const fullName = `${admin.user.first_name} ${admin.user.last_name}`;
              const initials = `${admin.user.first_name[0]}${admin.user.last_name[0]}`;
              const isCurrentUser = admin.user_id === currentUserId;
              const isOwner = roleKey === 'OWNER';

              return (
                <TableRow key={admin.id}>
                  {/* Member */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {admin.profile_picture_url && (
                          <AvatarImage src={admin.profile_picture_url} alt={fullName} />
                        )}
                        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium leading-none">{fullName}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                          {isOwner && (
                            <Badge variant="secondary" className={cn('gap-1 text-xs', role.color)}>
                              <RoleIcon className="size-3" />
                              {role.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{admin.user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Position */}
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.position || '-'}
                  </TableCell>

                  {/* Permissions */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {PERMISSIONS.map(({ key, label }) => {
                        const enabled = admin[key];
                        return (
                          <span
                            key={key}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                              enabled
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground/50',
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
                    {formatDate(admin.created_at)}
                  </TableCell>

                  {/* Actions */}
                  {canManage && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={isOwner || isCurrentUser || isSubmitting}
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <RemoveDialog
                            adminName={fullName}
                            adminId={admin.id}
                            onRemove={onRemove}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
