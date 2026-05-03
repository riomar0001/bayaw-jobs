"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
            href="/"
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Job Tally
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/") ? "text-primary" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/jobs") ? "text-primary" : ""}`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/companies") ? "text-primary" : ""}`}
            >
              Companies
            </Link>
            <Link
              href="/hire"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/hire") ? "text-primary" : ""}`}
            >
              For Employers
            </Link>
            <Link
              href="/about"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/about") ? "text-primary" : ""}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-foreground/80 hover:text-primary transition-colors font-medium ${isActivePath("/contact") ? "text-primary" : ""}`}
            >
              Contact
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    {mounted ? (
                      <Avatar className="h-9 w-9 border border-primary/20">
                        {user?.profile_picture_url && (
                          <AvatarImage
                            src={user.profile_picture_url}
                            alt={userName}
                          />
                        )}
                        <AvatarFallback className="bg-linear-to-br from-sky-500 to-cyan-600 text-white font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarFallback className="bg-linear-to-br from-sky-500 to-cyan-600 text-white font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm font-medium hidden lg:inline">
                      {userName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "ADMIN" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {!user?.applicant_profile_id && !user?.company_id && (
                        <DropdownMenuItem asChild>
                          <Link href="/onboarding" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Complete Account Onboarding
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user?.applicant_profile_id && (
                        <DropdownMenuItem asChild>
                          <Link href="/applicant/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Applicant Profile
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user?.company_id && (
                        <DropdownMenuItem asChild>
                          <Link href="/company" className="cursor-pointer">
                            <Building2 className="mr-2 h-4 w-4" />
                            Company Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/applicant/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
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
            <Link
              href="/"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/jobs") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/companies") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              href="/hire"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/hire") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              For Employers
            </Link>

            <Link
              href="/about"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/about") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block py-2 text-foreground/80 hover:text-primary transition-colors ${isActivePath("/contact") ? "text-primary font-medium" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/applicant/settings"
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
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
