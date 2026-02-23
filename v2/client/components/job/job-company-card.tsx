import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Briefcase, ExternalLink } from "lucide-react";
import type { Company } from "@/data";

interface JobCompanyCardProps {
  company: Company;
}

export function JobCompanyCard({ company }: JobCompanyCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">About the Company</h3>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border">
            <span className="font-bold bg-gradient-to-br from-sky-500 to-cyan-600 bg-clip-text text-transparent">
              {company.logo}
            </span>
          </div>
          <div>
            <p className="font-semibold">{company.name}</p>
            <p className="text-xs text-muted-foreground">{company.industry}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary/70" />
            {company.location}
          </div>
          {company.employeeCount && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-primary/70" />
              {company.employeeCount} employees
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary/70" />
            {company.openPositions} open positions
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t">
          <Link href={`/companies/${company.id}`}>
            <Button variant="outline" className="w-full" size="sm">
              View Company
            </Button>
          </Link>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full" size="sm">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                Visit Website
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
