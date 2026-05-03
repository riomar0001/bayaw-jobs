"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthFormLayout } from "@/components/shared/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { OtpInput } from "@/components/auth/otp-input";
import { AuthError } from "@/components/auth/auth-error";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    verifyOtp,
    resetLoginStep,
    isLoading,
    error,
    _loginStep,
    clearError,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await verifyOtp(otp);
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated) return;
    // Route based on existing profile
    if (user?.role === "ADMIN") {
      router.push("/admin");
      return;
    }
    if (user?.applicant_profile_id) {
      router.push("/");
      return;
    }
    if (user?.company_id) {
      router.push("/company");
      return;
    }
    router.push("/onboarding");
  };

  if (_loginStep === "otp") {
    return (
      <AuthFormLayout
        title="Verify Your Identity"
        description="Enter the 6-digit code sent to your email"
      >
        <form onSubmit={handleOtp} className="space-y-6">
          <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

          <AuthError message={error} />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length < 6 || otp.includes(" ")}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verify Code
          </Button>

          <button
            type="button"
            onClick={() => {
              resetLoginStep();
              setOtp("");
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto "
          >
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </button>
        </form>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Welcome Back"
      description="Sign in to access your account and explore job opportunities"
    >
      <form onSubmit={handleCredentials} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <AuthError message={error} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthFormLayout>
  );
}
