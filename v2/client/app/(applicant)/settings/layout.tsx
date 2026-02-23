"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, History } from "lucide-react";
import { Footer } from "@/components/shared/footer";

const navItems = [
  { label: "Information", href: "/settings/information", icon: User },
  { label: "Password", href: "/settings/password", icon: Lock },
  { label: "Login History", href: "/settings/login-history", icon: History },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <main className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your personal information and account security.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Nav */}
            <aside className="w-full md:w-56 flex-shrink-0">
              <nav className="flex flex-col gap-1 bg-card border rounded-xl p-2 shadow-sm">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Page Content */}
            <div className="flex-1 bg-card border rounded-xl shadow-sm p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
