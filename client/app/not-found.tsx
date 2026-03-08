import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Giant watermark 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-black leading-none tracking-tighter"
          style={{
            fontSize: "clamp(8rem, 30vw, 22rem)",
            color: "transparent",
            WebkitTextStroke: "1.5px oklch(0.6 0.18 195 / 0.07)",
          }}
        >
          404
        </span>
      </div>

      {/* Top + bottom accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

      {/* Floating decorative dots */}
      <div className="absolute top-24 left-16 w-2.5 h-2.5 rounded-full bg-primary/25 animate-float" />
      <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-primary/20 animate-float-delayed" />
      <div className="absolute bottom-28 right-28 w-2 h-2 rounded-full bg-primary/20 animate-float" />

      {/* Floating rotated squares */}
      <div
        className="absolute top-1/4 right-14 w-14 h-14 border border-primary/10 rounded-sm animate-float-delayed"
        style={{ transform: "rotate(30deg)" }}
      />
      <div
        className="absolute bottom-1/4 left-16 w-10 h-10 border border-primary/10 rounded-sm animate-float"
        style={{ transform: "rotate(15deg)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-md">
        {/* Status badge */}
        <div className="mb-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-semibold tracking-[0.12em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Position Unavailable
        </div>

        {/* Job listing card */}
        <div className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/[0.06] dark:shadow-black/20 p-7 mb-7 text-left">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight mb-0.5">
                Page Not Found
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-wide">
                REF: ERR-404
              </p>
            </div>
            <span className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-semibold tracking-wide">
              Closed
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/70 mb-5" />

          {/* Meta rows */}
          <dl className="space-y-3 mb-5">
            {[
              { label: "Location", value: "Unknown Territory" },
              { label: "Job Type", value: "Full-time (Missing)" },
              { label: "Department", value: "Not Applicable" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {label}
                </dt>
                <dd className="text-sm text-foreground/65 font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Divider */}
          <div className="h-px bg-border/70 mb-5" />

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for has been removed, renamed, or never
            existed. Let&apos;s find you something better.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 w-full">
          <Button asChild size="lg" className="flex-1 font-semibold">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 font-semibold"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {/* Support link */}
        <p className="mt-6 text-xs text-muted-foreground/55">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/40 transition-colors"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
