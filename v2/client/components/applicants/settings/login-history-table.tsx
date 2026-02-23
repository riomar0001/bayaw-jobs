"use client";

import { Badge } from "@/components/ui/badge";
import { mockLoginHistory, type LoginHistoryEntry } from "@/data/mockData";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Calendar,
} from "lucide-react";

function DeviceIcon({ device }: { device: LoginHistoryEntry["device"] }) {
  if (device === "mobile")
    return <Smartphone className="h-5 w-5 text-muted-foreground" />;
  if (device === "tablet")
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

export function LoginHistoryTable() {
  return (
    <div className="space-y-3">
      {mockLoginHistory.map((entry) => (
        <div
          key={entry.id}
          className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
            entry.current
              ? "border-primary/30 bg-primary/5"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          {/* Device Icon */}
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <DeviceIcon device={entry.device} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">
                {entry.browser} · {entry.os}
              </span>
              {entry.current && (
                <Badge variant="default" className="text-xs">
                  Current Session
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {entry.ip}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {entry.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(entry.date)}
              </span>
            </div>
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground pt-2">
        Showing the last {mockLoginHistory.length} login sessions. Older
        sessions are automatically removed after 30 days.
      </p>
    </div>
  );
}
