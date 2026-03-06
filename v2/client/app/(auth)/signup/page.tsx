"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthFormLayout } from "@/components/shared/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthError } from "@/components/auth/auth-error";
import {
  PasswordStrength,
  isPasswordValid,
} from "@/components/auth/password-strength";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, Mail } from "lucide-react";

export default function SignupPage() {
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (formData.password !== formData.confirmPassword) return;
    if (!isPasswordValid(formData.password)) return;

    await register({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
    });

    // If no error, registration succeeded
    const { error: storeError } = useAuthStore.getState();
    if (!storeError) setRegistered(true);
  };

  if (registered) {
    return (
      <AuthFormLayout
        title="Check Your Email"
        description="We've sent a verification link to your email address"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                We sent a verification link to
              </p>
              <p className="font-medium">{formData.email}</p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to activate your account.
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </AuthFormLayout>
    );
  }

  const set = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <AuthFormLayout
      title="Create Your Account"
      description="Join Bayaw Jobs and connect with top employers and opportunities"
    >
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="first_name">First Name</FieldLabel>
              <Input
                id="first_name"
                type="text"
                placeholder="John"
                required
                autoComplete="off"
                value={formData.first_name}
                onChange={(e) => set("first_name", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
              <Input
                id="last_name"
                type="text"
                placeholder="Doe"
                required
                autoComplete="off"
                value={formData.last_name}
                onChange={(e) => set("last_name", e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="off"
              value={formData.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => set("password", e.target.value)}
            />
            <PasswordStrength password={formData.password} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  Passwords do not match
                </p>
              )}
          </Field>
        </FieldGroup>

        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              set("agreeToTerms", checked as boolean)
            }
            className="mt-1"
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm font-normal leading-relaxed cursor-pointer"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <AuthError message={error} />

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLoading ||
            !formData.agreeToTerms ||
            !isPasswordValid(formData.password) ||
            formData.password !== formData.confirmPassword
          }
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign Up
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthFormLayout>
  );
}
