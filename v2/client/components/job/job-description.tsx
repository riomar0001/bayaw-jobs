import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/data";

interface JobDescriptionProps {
  job: Job;
}

export function JobDescription({ job }: JobDescriptionProps) {
  return (
    <Card>
      <CardContent className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            {job.description}
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Responsibilities</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            {job.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            {job.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, i) => (
              <Badge key={i} variant="secondary">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
