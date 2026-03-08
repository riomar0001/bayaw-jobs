"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/api/services/auth.service";
import type { LoginHistoryItem } from "@/api/types";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

function DeviceIcon({ device }: { device: string | null }) {
  const d = device?.toLowerCase() ?? "";
  if (d.includes("mobile") || d.includes("phone"))
    return <Smartphone className="h-5 w-5 text-muted-foreground" />;
  if (d.includes("tablet"))
    return <Tablet className="h-5 w-5 text-muted-foreground" />;
  return <Monitor className="h-5 w-5 text-muted-foreground" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildLocation(item: LoginHistoryItem): string | null {
  const parts = [item.city, item.region, item.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function LoginHistoryTable() {
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService
      .getLoginHistory()
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load login history. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading login history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No login sessions found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => {
        const location = buildLocation(entry);
        return (
          <div
            key={entry.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
              entry.is_active
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            {/* Device Icon */}
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <DeviceIcon device={entry.device} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {[entry.browser, entry.os].filter(Boolean).join(" · ") ||
                    "Unknown device"}
                </span>
                {entry.is_active && (
                  <Badge variant="default" className="text-xs">
                    Current Session
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {entry.ip_address && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {entry.ip_address}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(entry.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground pt-2">
        Showing {history.length} login session{history.length !== 1 ? "s" : ""}.
        Older sessions are automatically removed after 30 days.
      </p>
    </div>
  );
}
