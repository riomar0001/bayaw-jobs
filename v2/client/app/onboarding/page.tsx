"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export default function OnboardingSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    // Already has a profile — skip selection
    if (user?.applicant_profile_id) { router.replace("/applicant"); return; }
    if (user?.company_id) { router.replace("/company"); return; }
  }, [mounted, isLoading, user, router]);

  // Show loader until client-side state is known
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Bayaw Jobs</h1>
          <p className="text-muted-foreground">
            How would you like to get started? You can always set up the other
            account later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Job Seeker */}
          <Link href="/applicant/onboarding" className="group">
            <div className="h-full rounded-2xl border bg-background p-8 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-200">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">I&apos;m a Job Seeker</h2>
                <p className="text-sm text-muted-foreground">
                  Build your profile, upload your resume, and apply to jobs that
                  match your skills and experience.
                </p>
              </div>
              <Button className="mt-auto w-full gap-2 group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>

          {/* Company */}
          <Link href="/company/register" className="group">
            <div className="h-full rounded-2xl border bg-background p-8 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-200">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">I&apos;m a Recruiter</h2>
                <p className="text-sm text-muted-foreground">
                  Create a company account, post job openings, and find the
                  best talent for your team.
                </p>
              </div>
              <Button className="mt-auto w-full gap-2 group-hover:gap-3 transition-all">
                Create Company <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Want to explore first?{" "}
          <Link href="/jobs" className="text-primary hover:underline font-medium">
            Browse jobs
          </Link>
        </p>
      </div>
    </div>
  );
}
