import { Card, CardContent } from "@/components/ui/card";
import type { Company } from "@/data";

interface CompanyAboutProps {
  company: Company;
}

export function CompanyAbout({ company }: CompanyAboutProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-lg font-semibold mb-4">About {company.name}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {company.name} is a leading {company.industry.toLowerCase()} company
          based in {company.location}. With{" "}
          {company.employeeCount ?? "a growing number of"} employees, we are
          committed to building innovative solutions and fostering a culture of
          excellence, collaboration, and continuous growth.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          We believe great work happens when talented people have the freedom to
          do their best. That&apos;s why we invest in our people, our tools, and
          our processes to create an environment where everyone can thrive.
        </p>
      </CardContent>
    </Card>
  );
}
