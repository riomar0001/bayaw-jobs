import { Card, CardContent } from "@/components/ui/card";
import type { PublicCompany } from "@/api/types";

interface CompanyAboutProps {
  company: PublicCompany;
}

export function CompanyAbout({ company }: CompanyAboutProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-lg font-semibold mb-4">About {company.company_name}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {company.about}
        </p>
      </CardContent>
    </Card>
  );
}
