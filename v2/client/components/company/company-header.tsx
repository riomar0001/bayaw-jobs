import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Users,
  Briefcase,
  Building2,
  ExternalLink,
  Globe,
} from "lucide-react";
import type { Company } from "@/data";

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border">
            <span className="text-3xl font-bold bg-gradient-to-br from-sky-500 to-cyan-600 bg-clip-text text-transparent">
              {company.logo}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{company.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4 text-primary/70" />
              <span>{company.industry}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary/70" />
                {company.location}
              </div>
              {company.employeeCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary/70" />
                  {company.employeeCount} employees
                </div>
              )}
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Briefcase className="h-4 w-4" />
                {company.openPositions} open positions
              </div>
            </div>
          </div>
        </div>

        {company.website && (
          <div className="flex flex-wrap gap-3">
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Website
                <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
