"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth.store";
import { useCompanyOnboarding } from "@/hooks/use-company-onboarding";

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Construction",
  "Transportation & Logistics",
  "Media & Entertainment",
  "Government",
  "Non-profit",
  "Consulting",
  "Real Estate",
  "Legal",
  "Food & Beverage",
  "Other",
];

type View = "select" | "recruiter-step1" | "recruiter-step2";

const RECRUITER_STEPS = [
  { label: "Company Info" },
  { label: "Contact & Location" },
];

export default function OnboardingSelectionPage() {
  const router = useRouter();
  const { isLoading, user, refresh, _hasHydrated } = useAuthStore();
  const [view, setView] = useState<View>("select");

  const onSuccess = useCallback(async () => {
    await refresh();
    router.replace("/company");
  }, [refresh, router]);

  const { form, setField, submit, isSubmitting, error } =
    useCompanyOnboarding(onSuccess);

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;
    if (user?.applicant_profile_id) {
      router.replace("/applicant");
      return;
    }
    if (user?.company_id) {
      router.replace("/company");
      return;
    }
  }, [_hasHydrated, isLoading, user, router]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Selection screen ──────────────────────────────────────────────────────
  if (view === "select") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to Job Tally</h1>
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
                  <h2 className="text-xl font-semibold mb-1">
                    I&apos;m a Job Seeker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Build your profile, upload your resume, and apply to jobs
                    that match your skills and experience.
                  </p>
                </div>
                <Button className="mt-auto w-full gap-2 group-hover:gap-3 transition-all">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Link>

            {/* Recruiter */}
            <button
              className="group text-left"
              onClick={() => setView("recruiter-step1")}
            >
              <div className="h-full rounded-2xl border bg-background p-8 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    I&apos;m a Recruiter
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Create a company account, post job openings, and find the
                    best talent for your team.
                  </p>
                </div>
                <Button
                  asChild
                  className="mt-auto w-full gap-2 group-hover:gap-3 transition-all pointer-events-none"
                >
                  <span>
                    Create Company <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Want to explore first?{" "}
            <Link
              href="/jobs"
              className="text-primary hover:underline font-medium"
            >
              Browse jobs
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Recruiter onboarding form ─────────────────────────────────────────────
  const currentStep = view === "recruiter-step1" ? 1 : 2;

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setView("recruiter-step2");
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Set Up Your Company</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {RECRUITER_STEPS.length} —{" "}
              {RECRUITER_STEPS[currentStep - 1].label}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {RECRUITER_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {/* ── Step 1: Company Info ── */}
            {view === "recruiter-step1" && (
              <form onSubmit={handleStep1Next} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    required
                    placeholder="Acme Corp"
                    value={form.company_name}
                    onChange={(e) => setField("company_name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_position">Your Position *</Label>
                  <Input
                    id="owner_position"
                    required
                    placeholder="CEO, HR Manager, Recruiter..."
                    value={form.owner_position}
                    onChange={(e) => setField("owner_position", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Select
                      required
                      value={form.industry}
                      onValueChange={(v) => setField("industry", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Size *</Label>
                    <Select
                      required
                      value={form.company_size}
                      onValueChange={(v) => setField("company_size", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundation_year">Founded Year *</Label>
                    <Input
                      id="foundation_year"
                      type="number"
                      required
                      min={1800}
                      max={new Date().getFullYear()}
                      placeholder="2010"
                      value={form.foundation_year}
                      onChange={(e) =>
                        setField("foundation_year", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website *</Label>
                    <Input
                      id="website"
                      type="url"
                      required
                      placeholder="https://yourcompany.com"
                      value={form.website}
                      onChange={(e) => setField("website", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About Company *</Label>
                  <Textarea
                    id="about"
                    required
                    rows={4}
                    placeholder="Briefly describe what your company does..."
                    value={form.about}
                    onChange={(e) => setField("about", e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setView("select")}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* ── Step 2: Contact & Location ── */}
            {view === "recruiter-step2" && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      required
                      placeholder="hr@yourcompany.com"
                      value={form.contact_email}
                      onChange={(e) =>
                        setField("contact_email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      required
                      placeholder="+63 912 345 6789"
                      value={form.contact_phone}
                      onChange={(e) =>
                        setField("contact_phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <hr className="border-border" />

                <p className="text-sm font-medium text-muted-foreground">
                  Headquarters Location{" "}
                  <span className="text-xs">(optional)</span>
                </p>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Makati City"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      placeholder="Metro Manila"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Philippines"
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      placeholder="1200"
                      value={form.postal_code}
                      onChange={(e) => setField("postal_code", e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setView("recruiter-step1")}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Setting
                        up...
                      </>
                    ) : (
                      <>
                        Finish Setup <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Changed your mind?{" "}
          <button
            className="text-primary hover:underline font-medium"
            onClick={() => setView("select")}
          >
            Go back to selection
          </button>
        </p>
      </div>
    </div>
  );
}
