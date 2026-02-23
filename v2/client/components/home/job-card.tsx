"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Clock } from "lucide-react";
import type { Job } from "@/data";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group border hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:border-primary/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20 transition-colors"
          >
            {job.type}
          </Badge>
          {job.featured && (
            <div className="flex items-center gap-1 text-xs text-primary font-semibold">
              <Clock className="h-3 w-3" />
              New
            </div>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {job.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 relative">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="mr-2 h-4 w-4 text-primary/70" />
            <span className="font-medium">{job.company}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary/70" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center text-sm font-semibold text-primary">
              <DollarSign className="mr-1 h-4 w-4" />
              {job.salary}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full transition-all">
            View Job
          </Button>
        </Link>
        <Button
          className="flex-1 group-hover:bg-primary group-hover:shadow-lg transition-all"
          onClick={() => console.log("Apply clicked for", job.title)}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
