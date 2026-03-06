import { useState } from "react";
import { businessService } from "@/api/services/business.service";
import type { BusinessOnboardingInput } from "@/api/types";

export interface CompanyOnboardingForm {
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

export const INITIAL_FORM: CompanyOnboardingForm = {
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

export function useCompanyOnboarding(onSuccess: () => Promise<void>) {
  const [form, setForm] = useState<CompanyOnboardingForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof CompanyOnboardingForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (): Promise<boolean> => {
    setError(null);
    setIsSubmitting(true);

    const payload: BusinessOnboardingInput = {
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
      locations: form.address
        ? [
            {
              address: form.address,
              city: form.city,
              state: form.state,
              country: form.country,
              postal_code: form.postal_code,
              is_headquarter: true,
            },
          ]
        : [],
    };

    try {
      await businessService.completeOnboarding(payload);
      await onSuccess();
      return true;
    } catch (err) {
      setError(
        (err as Error).message ?? "Something went wrong. Please try again.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, setField, submit, isSubmitting, error };
}
