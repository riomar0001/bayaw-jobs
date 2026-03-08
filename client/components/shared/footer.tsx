import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-muted/20 to-muted/50 mt-20 border-t border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(136, 136, 136, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(136, 136, 136, 0.1) 1px, transparent 1px)",
            backgroundSize: "3rem 3rem",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Top Section - Brand and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-2xl"
            >
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Bayaw Jobs
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Connecting talented professionals with amazing opportunities
              worldwide.
            </p>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              For Companies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/company"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/company/signup"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Create Company Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Bayaw Jobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
