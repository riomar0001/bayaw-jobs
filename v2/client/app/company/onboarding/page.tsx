"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, ArrowRight, Building2, Loader2 } from "lucide-react";
import { businessService } from "@/api/services/business.service";
import { useAuthStore } from "@/stores/auth.store";

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

const TOTAL_STEPS = 2;

const STEPS = [
  { label: "Company Info" },
  { label: "Contact & Location" },
];

interface FormData {
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  foundation_year: string;
  website: string;
  owner_position: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

const initialForm: FormData = {
  company_name: "",
  industry: "",
  about: "",
  company_size: "",
  foundation_year: "",
  website: "",
  owner_position: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
};

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await businessService.completeOnboarding({
        company_name: form.company_name,
        industry: form.industry,
        about: form.about,
        company_size: form.company_size,
        foundation_year: Number(form.foundation_year),
        website: form.website,
        owner_position: form.owner_position,
        contact: {
          email: form.contact_email,
          phone: form.contact_phone,
        },
        ...(form.address
          ? {
              locations: [
                {
                  address: form.address,
                  city: form.city,
                  state: form.state,
                  country: form.country,
                  postal_code: form.postal_code,
                  is_headquarter: true,
                },
              ],
            }
          : { locations: [] }),
      });
      // Refresh token so company_id gets into the store
      await refresh();
      router.replace("/company");
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
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
              Step {step} of {TOTAL_STEPS} — {STEPS[step - 1].label}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    required
                    placeholder="Acme Corp"
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_position">Your Position *</Label>
                  <Input
                    id="owner_position"
                    required
                    placeholder="CEO, HR Manager, Recruiter..."
                    value={form.owner_position}
                    onChange={(e) => set("owner_position", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Select
                      required
                      value={form.industry}
                      onValueChange={(v) => set("industry", v)}
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
                      onValueChange={(v) => set("company_size", v)}
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
                      onChange={(e) => set("foundation_year", e.target.value)}
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
                      onChange={(e) => set("website", e.target.value)}
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
                    onChange={(e) => set("about", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      onChange={(e) => set("contact_email", e.target.value)}
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
                      onChange={(e) => set("contact_phone", e.target.value)}
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
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Makati City"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      placeholder="Metro Manila"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
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
                      onChange={(e) => set("country", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      placeholder="1200"
                      value={form.postal_code}
                      onChange={(e) => set("postal_code", e.target.value)}
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
                    onClick={() => setStep(1)}
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Complete Setup
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

