"use client";

import { useEffect, useState } from "react";
import { authService } from "@/api/services/auth.service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export function OtpToggle() {
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    authService.getAccountInfo().then((info) => {
      setEnabled(info.otp_enabled);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleToggle = async (value: boolean) => {
    setIsSaving(true);
    try {
      await authService.updateOtpSetting(value);
      setEnabled(value);
      toast.success(value ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted mt-0.5">
          <ShieldCheck className="size-4 text-muted-foreground" />
        </div>
        <div>
          <Label htmlFor="otp-toggle" className="text-sm font-medium cursor-pointer">
            Two-Factor Authentication (Email OTP)
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            When enabled, a one-time code is sent to your email each time you sign in.
          </p>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-6 w-11 rounded-full" />
      ) : (
        <Switch
          id="otp-toggle"
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isSaving}
        />
      )}
    </div>
  );
}
