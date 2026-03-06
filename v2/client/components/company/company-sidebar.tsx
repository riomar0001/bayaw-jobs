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

interface CompanySidebarProps {
  company: PublicCompany;
}

export function CompanySidebar({ company }: CompanySidebarProps) {
  const hq =
    company.companyLocations.find((l) => l.is_headquarter) ??
    company.companyLocations[0];
  const location = hq ? `${hq.city}, ${hq.country}` : null;

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Company Overview</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Industry</p>
                <p className="text-sm font-medium">{company.industry}</p>
              </div>
            </div>

            {location && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{location}</p>
                </div>
              </div>
            )}

            {company.company_size && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company Size</p>
                  <p className="text-sm font-medium">
                    {company.company_size} employees
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open Positions</p>
                <p className="text-sm font-medium">
                  {company.open_positions} jobs
                </p>
              </div>
            </div>

            {company.website && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Visit site
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      {/* <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center space-y-3">
          <Briefcase className="h-8 w-8 text-primary mx-auto" />
          <p className="font-semibold">Interested in working here?</p>
          <p className="text-xs text-muted-foreground">
            Browse all open positions and find the role that&apos;s right for
            you.
          </p>
          <a href="#open-positions">
            <Button className="w-full" size="sm">
              View All Jobs
            </Button>
          </a>
        </CardContent>
      </Card> */}
    </div>
  );
}
