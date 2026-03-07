"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, CheckCircle, Loader2 } from "lucide-react";
import { authService } from "@/api/services/auth.service";
import { ApiError } from "@/api/client";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function InformationForm() {
  const { updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    async function loadInfo() {
      try {
        const info = await authService.getAccountInfo();
        setForm({
          firstName: info.first_name,
          lastName: info.last_name,
          email: info.email,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load account information.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const updatedInfo = await authService.updateAccountInfo({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
      });
      updateUser({
        first_name: updatedInfo.first_name,
        last_name: updatedInfo.last_name,
        email: updatedInfo.email,
      });
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update account information.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              className="pl-9"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              className="pl-9"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            className="pl-9"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={saving || !form.firstName || !form.lastName || !form.email}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
