import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: "applicant" | "employer";
}

export function HeroSection({
  title,
  subtitle,
  children,
  variant = "applicant",
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative py-20 md:py-28 px-4 overflow-hidden",
        variant === "employer"
          ? "bg-gradient-to-br from-primary/10 via-background to-primary/5"
          : "bg-gradient-to-br from-sky-50/50 via-cyan-50/30 to-background dark:from-sky-950/20 dark:via-cyan-950/10 dark:to-background",
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000 opacity-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl opacity-10" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-80">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(136, 136, 136, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(136, 136, 136, 0.1) 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage:
                "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
            }}
          />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-primary/20 rounded-lg rotate-45 animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-sky-500/20 rounded-full animate-float-delayed" />
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-background"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64 C320,120 640,0 960,64 C1120,96 1200,80 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
