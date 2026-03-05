"use client";

import React from "react";
import NextLink from "next/link";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/company/dashboard/layout/app-sidebar";
import { Footer } from "@/components/shared/footer";
import { CTABanner } from "@/components/shared/cta-banner";
import { ValueProposition } from "@/components/shared/value-proposition";
import { HeroSection } from "@/components/shared/hero-section";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";

import { Target, Users, Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated] = React.useState(true);

  return (
    <>
      {isAuthenticated ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      ) : (
        <main>
          <Navbar />
          {/* Hero Section */}
          <HeroSection
            variant="employer"
            title="Hire the Best Talent for Your Team"
            subtitle="Post jobs and connect with qualified candidates who are ready to make an impact"
          >
            <div className="flex justify-center gap-4 mt-8">
              <NextLink href="/company/signup">
                <Button size="lg" className="px-8">
                  Post a Job
                </Button>
              </NextLink>

              <NextLink href="/company/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </NextLink>
            </div>
          </HeroSection>

          {/* Value Propositions */}
          <section className="container mx-auto px-4 py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold mb-2">
                Why Choose Bayaw Jobs?
              </h2>
              <p className="text-muted-foreground">
                Everything you need to find and hire the best talent
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <ValueProposition
                icon={<Users className="h-8 w-8" />}
                title="Access Top Talent"
                description="Connect with thousands of qualified professionals actively seeking new opportunities"
              />

              <ValueProposition
                icon={<Zap className="h-8 w-8" />}
                title="Quick Hiring"
                description="Fill positions faster with our streamlined process and qualified candidate pipeline"
              />

              <ValueProposition
                icon={<Target className="h-8 w-8" />}
                title="Targeted Matching"
                description="AI-powered matching to find candidates with the perfect skills and experience"
              />
            </div>
          </section>

          {/* CTA Banner */}
          <section className="container mx-auto px-4 py-20">
            <CTABanner
              title="Ready to Start Hiring?"
              description="Join hundreds of companies finding their next great hire on Bayaw Jobs"
              buttonText="Get Started"
              buttonHref="/company/signup"
            />
          </section>

          {/* Footer */}
          <Footer />
        </main>
      )}
    </>
  );
}
