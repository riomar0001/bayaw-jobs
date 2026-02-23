import { HeroSection } from "@/components/shared/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { JobCard } from "@/components/home/job-card";
import { CompanyCard } from "@/components/home/company-card";
import { Footer } from "@/components/shared/footer";
import { jobs, companies } from "@/data";
import { TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection
        title="Find Your Dream Job Today"
        subtitle="Connect with top companies and discover opportunities that match your skills and career goals"
      >
        <SearchBar />
      </HeroSection>

      {/* Featured Jobs Section */}
      <section className="relative container mx-auto px-4 py-20">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />

        <div className="mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Hot Jobs</span>
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Featured Opportunities
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the latest job openings from top companies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {jobs.slice(0, 8).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="relative py-20 bg-gradient-to-b from-muted/30 to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(136, 136, 136, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(136, 136, 136, 0.1) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage:
                "radial-gradient(ellipse 80% 50% at 50% 50%, #000 70%, transparent 110%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 mx-auto">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Trending
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Top Companies Hiring
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              Join these amazing companies and grow your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
