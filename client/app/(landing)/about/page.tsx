import { HeroSection } from "@/components/shared/hero-section";
import { ValueProposition } from "@/components/shared/value-proposition";
import { CTABanner } from "@/components/shared/cta-banner";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Shield,
  Globe,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection
        title="About Bayaw Jobs"
        subtitle="Connecting talented professionals with amazing opportunities worldwide"
      />

      {/* Story Section */}
      <section className="relative container mx-auto px-4 py-20">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />

        <div className="mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">
              Our Story
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Building Bridges Between Talent and Opportunity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Left: Story */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bayaw Jobs was founded with a simple yet powerful mission: to make
              finding the perfect job or the ideal candidate easier, faster, and
              more meaningful. We understand that careers are more than just
              paychecks—they&apos;re about growth, purpose, and fulfillment.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform leverages cutting-edge technology to match job
              seekers with opportunities that align with their skills, values,
              and career aspirations. For companies, we provide access to a
              diverse pool of qualified candidates ready to make an impact.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Since our launch, we&apos;ve helped thousands of professionals
              find their dream roles and enabled hundreds of companies to build
              exceptional teams. We&apos;re just getting started.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="border hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  50,000+
                </div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  1,000+
                </div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  100,000+
                </div>
                <div className="text-sm text-muted-foreground">
                  Successful Hires
                </div>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">
                  Satisfaction Rate
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
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
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Our Values
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              What We Stand For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ValueProposition
              icon={<Sparkles className="h-8 w-8" />}
              title="Innovation"
              description="We continuously evolve our platform with cutting-edge technology to deliver the best job matching experience for both candidates and companies."
            />
            <ValueProposition
              icon={<Shield className="h-8 w-8" />}
              title="Integrity"
              description="Trust and transparency are at the heart of our operations. We're committed to creating authentic connections and maintaining the highest ethical standards."
            />
            <ValueProposition
              icon={<Globe className="h-8 w-8" />}
              title="Accessibility"
              description="Everyone deserves access to great opportunities. We're dedicated to making our platform inclusive and available to professionals from all backgrounds."
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-20">
        <CTABanner
          title="Join Our Growing Community"
          description="Whether you're looking for talent or your next opportunity, Bayaw Jobs is here to help you succeed"
          buttonText="Get Started"
          buttonHref="/signup"
        />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
