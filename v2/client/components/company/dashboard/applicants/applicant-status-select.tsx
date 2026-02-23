"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicationStatus } from "@/types/job";

interface ApplicantStatusSelectProps {
  value: ApplicationStatus;
  onChange?: (value: ApplicationStatus) => void;
}

const statuses: ApplicationStatus[] = [
  "New",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export function ApplicantStatusSelect({
  value,
  onChange,
}: ApplicantStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
