import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function CTABanner({
  title,
  description,
  buttonText,
  buttonHref,
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-500 via-cyan-500 to-cyan-600 text-primary-foreground py-20 rounded-2xl shadow-2xl">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "3rem 3rem",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
          <span className="text-sm font-medium">Limited Time Offer</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {title}
        </h2>
        <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto drop-shadow">
          {description}
        </p>

        <Link href={buttonHref}>
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>1000+ Companies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>50,000+ Jobs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>100,000+ Candidates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
