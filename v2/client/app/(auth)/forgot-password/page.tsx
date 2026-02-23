"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthFormLayout } from "@/components/shared/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  if (isSubmitted) {
    return (
      <AuthFormLayout
        title="Check Your Email"
        description="We've sent password reset instructions to your email"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                We sent a password reset link to
              </p>
              <p className="font-medium">{email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:underline font-medium"
              >
                try another email address
              </button>
            </p>

            <Button asChild className="w-full" variant="outline">
              <Link href="/login">
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Forgot Password?"
      description="Enter your email and we'll send you instructions to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 size-4" />
            Back to Login
          </Link>
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Are you a company?{" "}
          <Link
            href="/company/forgot-password"
            className="text-primary hover:underline"
          >
            Reset company password
          </Link>
        </p>
      </form>
    </AuthFormLayout>
  );
}
