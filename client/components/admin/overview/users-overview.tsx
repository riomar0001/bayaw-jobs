import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface AdminUserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const roleVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ADMIN: 'destructive',
  COMPANY_OWNER: 'default',
  USER: 'secondary',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  SUSPENDED: 'destructive',
  PENDING_VERIFICATION: 'outline',
  DELETED: 'destructive',
};

interface UsersOverviewProps {
  users: AdminUserRow[];
}

export function UsersOverview({ users }: UsersOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Users</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {users.map((user) => {
            const initials = `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase();
            return (
              <div key={user.id} className="flex items-center gap-3 px-6 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={roleVariant[user.role] ?? 'outline'} className="text-xs">
                    {user.role}
                  </Badge>
                  <Badge variant={statusVariant[user.status] ?? 'outline'} className="text-xs">
                    {user.status}
                  </Badge>
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
