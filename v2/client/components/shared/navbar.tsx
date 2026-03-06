"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Briefcase,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const { isAuthenticated, user, logout } = useAuthStore();

  const userInitials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";
  const userName = user ? `${user.first_name} ${user.last_name}` : "";

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAuthenticated ? "/jobs" : "/"}
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bayaw Jobs
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!mounted ? (
            <div className="hidden md:flex items-center space-x-8" />
          ) : isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/jobs"
                className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/jobs") ? "text-primary" : ""}`}
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/companies") ? "text-primary" : ""}`}
              >
                Companies
              </Link>
              <Link
                href="/profile"
                className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/profile") ? "text-primary" : ""}`}
              >
                Profile
              </Link>
              <Link
                href="/contact"
                className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/contact") ? "text-primary" : ""}`}
              >
                Contact
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                href="/company"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                For Companies
              </Link>
              <Link
                href="/about"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Desktop Actions */}
          {!mounted ? (
            <div className="hidden md:flex items-center space-x-4 w-[172px]" />
          ) : isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline">
                      {userName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/jobs" className="cursor-pointer">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Find Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/companies" className="cursor-pointer">
                      <Building2 className="mr-2 h-4 w-4" />
                      Companies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            {!mounted ? null : isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/profile") ? "text-primary font-medium" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/jobs"
                  className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/jobs") ? "text-primary font-medium" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/companies"
                  className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/companies") ? "text-primary font-medium" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Companies
                </Link>
                <Link
                  href="/contact"
                  className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/contact") ? "text-primary font-medium" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      void handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/company"
                  className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Companies
                </Link>
                <Link
                  href="/about"
                  className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
