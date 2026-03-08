"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/company/dashboard", label: "Homepage" },
  { href: "/company/dashboard/candidates", label: "Candidates", active: true },
  { href: "/company/dashboard/positions", label: "Positions" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Admin Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                ⚡
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              coderspace
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">— ADMIN</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                link.active
                  ? "border border-border bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/admin.jpg" alt="Ahmet Hoşgör" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                AH
              </AvatarFallback>
            </Avatar>
            <button className="flex items-center gap-1 text-sm font-medium text-foreground">
              Ahmet Hoşgör
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-muted">
            EN
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
