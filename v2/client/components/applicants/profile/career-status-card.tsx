"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target } from "lucide-react";
import { toast } from "sonner";
import { applicantService } from "@/api/services/applicant.service";
import type { CareerStatus } from "@/api/types";

interface CareerStatusCardProps {
  status: CareerStatus;
  onStatusChange?: (status: CareerStatus) => void;
}

const STATUS_CONFIG: Record<
  CareerStatus,
  { label: string; dot: string; trigger: string }
> = {
  ACTIVELY_LOOKING: {
    label: "Actively Seeking Job",
    dot: "bg-green-500",
    trigger:
      "border-green-500/40 bg-green-500/5 text-green-700 dark:text-green-400",
  },
  OPEN_TO_OPPORTUNITIES: {
    label: "Open to Opportunities",
    dot: "bg-blue-500",
    trigger:
      "border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-400",
  },
  EMPLOYED_NOT_LOOKING: {
    label: "Employed (Not Looking)",
    dot: "bg-yellow-500",
    trigger:
      "border-yellow-500/40 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400",
  },
  NOT_LOOKING: {
    label: "Not Looking",
    dot: "bg-slate-400",
    trigger:
      "border-slate-400/40 bg-slate-400/5 text-slate-600 dark:text-slate-400",
  },
};

export function CareerStatusCard({
  status,
  onStatusChange,
}: CareerStatusCardProps) {
  const [current, setCurrent] = useState<CareerStatus>(status);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrent(status);
  }, [status]);

  const handleChange = (value: CareerStatus) => {
    const previous = current;
    setCurrent(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applicantService
        .updateCareerStatus(value)
        .then(() => {
          onStatusChange?.(value);
          toast.success("Career status updated");
        })
        .catch(() => {
          setCurrent(previous);
          toast.error("Failed to update career status");
        });
    }, 600);
  };

  return (
    <Card>
      <CardHeader >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Career Status</h2>
        </div>
      </CardHeader>

      <CardContent>
        <Select value={current} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_CONFIG) as CareerStatus[]).map((key) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[key].dot}`}
                  />
                  {STATUS_CONFIG[key].label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
