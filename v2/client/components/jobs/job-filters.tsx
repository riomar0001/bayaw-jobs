"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

export interface JobFiltersState {
  jobTypes: string[];
  location: string;
  salaryRange: number[];
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onFilterChange: (filters: JobFiltersState) => void;
}

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const handleJobTypeChange = (type: string, checked: boolean) => {
    const newJobTypes = checked
      ? [...filters.jobTypes, type]
      : filters.jobTypes.filter((t) => t !== type);
    onFilterChange({ ...filters, jobTypes: newJobTypes });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job Type */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Job Type</Label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.jobTypes.includes(type)}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(type, checked as boolean)
                  }
                />
                <Label htmlFor={type} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label htmlFor="location" className="text-sm font-semibold">
            Location
          </Label>
          <Input
            id="location"
            placeholder="Enter city or state..."
            value={filters.location}
            onChange={(e) =>
              onFilterChange({ ...filters, location: e.target.value })
            }
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Salary Range: ${filters.salaryRange[0]}k - ${filters.salaryRange[1]}
            k
          </Label>
          <Slider
            min={0}
            max={200}
            step={10}
            value={filters.salaryRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, salaryRange: value })
            }
            className="py-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}
