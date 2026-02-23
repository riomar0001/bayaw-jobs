"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavUser } from "@/components/company/dashboard/layout/nav-user";
import { mockUser } from "@/data";
import NavMain from "./nav-main";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Settings,
} from "lucide-react";

export function AppSidebar() {
  const navigation = [
    {
      title: "Dashboard",
      href: "/company",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      icon: Briefcase,
      items: [
        { title: "All Jobs", href: "/company/jobs" },
        { title: "Post New Job", href: "/company/jobs/new" },
      ],
    },
    {
      title: "Applicants",
      href: "/company/applicants",
      icon: Users,
    },
    {
      title: "Business Profile",
      href: "/company/business",
      icon: Building2,
    },
    {
      title: "Settings",
      icon: Settings,
      items: [
        { title: "Profile", href: "/company/settings/profile" },
        { title: "Security", href: "/company/settings/security" },
        { title: "Manage Admins", href: "/company/settings/admins" },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Bayaw Jobs</span>
            <span className="text-xs text-muted-foreground">
              Recruitment Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain navigation={navigation} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser
          user={{
            name: mockUser.fullName,
            email: mockUser.email,
            avatar: "",
            role: mockUser.role,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
