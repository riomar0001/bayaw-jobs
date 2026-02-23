"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { companies, jobs } from "@/data";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft } from "lucide-react";
import { CompanyHeader } from "@/components/company/company-header";
import { CompanyAbout } from "@/components/company/company-about";
import { CompanyOpenPositions } from "@/components/company/company-open-positions";
import { CompanySidebar } from "@/components/company/company-sidebar";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = companies.find((c) => c.id === id);

  if (!company) notFound();

  const companyJobs = jobs.filter(
    (j) => j.company.toLowerCase() === company.name.toLowerCase(),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="fixed top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-10 relative z-10 max-w-6xl">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CompanyHeader company={company} />
            <CompanyAbout company={company} />
            <CompanyOpenPositions jobs={companyJobs} />
          </div>

          <div className="lg:col-span-1">
            <CompanySidebar company={company} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
