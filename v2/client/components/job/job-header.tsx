import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Building2, CalendarDays } from "lucide-react";
import type { Job, Company } from "@/data";

interface JobHeaderProps {
  job: Job;
  company?: Company;
}

export function JobHeader({ job, company }: JobHeaderProps) {
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border">
              <span className="text-xl font-bold bg-gradient-to-br from-sky-500 to-cyan-600 bg-clip-text text-transparent">
                {company?.logo ?? job.company.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
              <Link
                href={company ? `/companies/${company.id}` : "#"}
                className="text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Building2 className="h-4 w-4" />
                {job.company}
              </Link>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 shrink-0"
          >
            {job.type}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary/70" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary/70" />
            Posted {job.postedDate}
          </div>
        </div>

        <Button size="lg" className="w-full sm:w-auto px-12">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
}
