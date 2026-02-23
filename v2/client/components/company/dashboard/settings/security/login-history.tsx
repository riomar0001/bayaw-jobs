import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Globe } from "lucide-react";

interface LoginEvent {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "unknown";
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
  status: "success" | "failed";
}

const loginHistory: LoginEvent[] = [
  {
    id: "1",
    device: "Windows 11",
    deviceType: "desktop",
    browser: "Chrome 121",
    location: "Istanbul, Turkey",
    ip: "78.162.xxx.xxx",
    timestamp: "2024-01-20 09:42:11",
    status: "success",
  },
  {
    id: "2",
    device: "iPhone 15",
    deviceType: "mobile",
    browser: "Safari 17",
    location: "Istanbul, Turkey",
    ip: "78.162.xxx.xxx",
    timestamp: "2024-01-18 14:15:03",
    status: "success",
  },
  {
    id: "3",
    device: "macOS Sonoma",
    deviceType: "desktop",
    browser: "Firefox 122",
    location: "Ankara, Turkey",
    ip: "88.247.xxx.xxx",
    timestamp: "2024-01-17 11:30:55",
    status: "success",
  },
  {
    id: "4",
    device: "Unknown Device",
    deviceType: "unknown",
    browser: "Unknown",
    location: "Amsterdam, Netherlands",
    ip: "185.220.xxx.xxx",
    timestamp: "2024-01-15 03:12:44",
    status: "failed",
  },
  {
    id: "5",
    device: "Windows 10",
    deviceType: "desktop",
    browser: "Edge 121",
    location: "Istanbul, Turkey",
    ip: "78.162.xxx.xxx",
    timestamp: "2024-01-14 17:08:29",
    status: "success",
  },
];

const DeviceIcon = ({ type }: { type: LoginEvent["deviceType"] }) => {
  if (type === "mobile")
    return <Smartphone className="size-4 text-muted-foreground" />;
  if (type === "desktop")
    return <Monitor className="size-4 text-muted-foreground" />;
  return <Globe className="size-4 text-muted-foreground" />;
};

export function LoginHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {loginHistory.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <DeviceIcon type={event.deviceType} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {event.device} · {event.browser}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.location} · {event.ip}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge
                  variant={
                    event.status === "success" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {event.status === "success" ? "Success" : "Failed"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {event.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
