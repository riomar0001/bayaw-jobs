"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthFormLayout } from "@/components/shared/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthError } from "@/components/auth/auth-error";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    clearError();
    await resetPassword(params.token, {
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    const { error: storeError } = useAuthStore.getState();
    if (!storeError) setDone(true);
  };

  if (done) {
    return (
      <AuthFormLayout
        title="Password Reset!"
        description="Your password has been updated successfully"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="size-8 text-green-500" />
            </div>
            <p className="text-center text-muted-foreground">
              You can now sign in with your new password.
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Reset Your Password"
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="new_password">New Password</FieldLabel>
            <Input
              id="new_password"
              type="password"
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm_password">Confirm New Password</FieldLabel>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                Passwords do not match
              </p>
            )}
          </Field>
        </FieldGroup>

        <AuthError message={error} />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || newPassword !== confirmPassword || !newPassword}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Reset Password
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 size-4" />
            Back to Login
          </Link>
        </Button>
      </form>
    </AuthFormLayout>
  );
}
