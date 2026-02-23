"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Building2, MapPin, ArrowRight } from "lucide-react";
import type { Company } from "@/data";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter();

  return (
    <Card
      className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border hover:border-primary/50 overflow-hidden relative h-full hover:-translate-y-1"
      onClick={() => router.push(`/companies/${company.id}`)}
    >
      <CardContent className="p-6 space-y-4">
        {/* Logo */}
        <div className="flex items-start justify-between">
          <div className="flex flex-row justify-center items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
              <span className="text-2xl font-bold bg-gradient-to-br from-sky-500 to-cyan-600 bg-clip-text text-transparent">
                {company.logo}
              </span>
            </div>
            {/* Company Name */}
            <div>
              <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary/70" />
                <span>{company.industry}</span>
              </div>
            </div>
          </div>

          {/* Open Positions Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
            <Briefcase className="mr-1 h-3 w-3" />
            {company.openPositions} Open
          </Badge>
        </div>

        {/* Location & Employee Count */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground truncate">
              {company.location}
            </span>
          </div>

          {company.employeeCount && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                {company.employeeCount}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* View Company Link */}
        <div
          className="flex items-center justify-between text-sm text-primary font-medium group/link hover:gap-3 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            View Company Profile
          </span>
          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}
