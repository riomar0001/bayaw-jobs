import Image from "next/image";
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
import type { PublicCompany } from "@/api/types";

interface CompanyHeaderProps {
  company: PublicCompany;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const hq =
    company.companyLocations.find((l) => l.is_headquarter) ??
    company.companyLocations[0];
  const location = hq ? `${hq.city}, ${hq.country}` : null;

  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 border overflow-hidden">
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.company_name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-bold bg-gradient-to-br from-sky-500 to-cyan-600 bg-clip-text text-transparent">
                {company.company_name[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{company.company_name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4 text-primary/70" />
              <span>{company.industry}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  {location}
                </div>
              )}
              {company.company_size && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary/70" />
                  {company.company_size} employees
                </div>
              )}
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Briefcase className="h-4 w-4" />
                {company.open_positions} open positions
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
