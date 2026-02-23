"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPipelineStages } from "@/data";
import { cn } from "@/lib/utils";

const stageColors: Record<string, string> = {
  New: "bg-blue-500",
  Screening: "bg-yellow-500",
  Interview: "bg-purple-500",
  Offer: "bg-green-500",
  Hired: "bg-emerald-500",
  Rejected: "bg-gray-400",
};

export function ApplicationPipeline() {
  const stages = mockPipelineStages;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.stage}</span>
              <span className="text-muted-foreground">
                {stage.count} ({stage.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", stageColors[stage.stage])}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
