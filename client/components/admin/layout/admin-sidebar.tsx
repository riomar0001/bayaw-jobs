'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/company/dashboard/layout/nav-user';
import { useAuthStore } from '@/stores/auth.store';
import NavMain from '@/components/company/dashboard/layout/nav-main';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Briefcase,
  ShieldCheck,
  ListTodo,
  ShieldAlert,
} from 'lucide-react';

export function AdminSidebar() {
  const user = useAuthStore((state) => state.user);

  const navigation = [
    {
      title: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Businesses',
      href: '/admin/businesses',
      icon: Building2,
    },
    {
      title: 'Applicants',
      href: '/admin/applicants',
      icon: UserCheck,
    },
    {
      title: 'Jobs',
      href: '/admin/jobs',
      icon: Briefcase,
    },
    {
      title: 'Security',
      icon: ShieldAlert,
      items: [
        { title: 'Event Log', href: '/admin/security' },
        { title: 'Queues', href: '/admin/queues' },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground font-bold">
            <ShieldCheck className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Job Tally</span>
            <span className="text-xs text-muted-foreground">Super Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain navigation={navigation} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser
          isAdmin
          user={{
            name: user ? `${user.first_name} ${user.last_name}` : '',
            email: user?.email ?? '',
            avatar: user?.profile_picture_url ?? '',
            role: user?.role ?? '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
