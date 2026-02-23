"use client";
import { Footer } from "@/components/shared/footer";
import { ArrowLeft, FileText } from "lucide-react";
import { terms as sections } from "@/constants/terms-and-privacy";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Return
        </button>
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Legal</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2025</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using Bayaw
            Jobs. By accessing or using our platform, you agree to be bound by
            the terms described below.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold mb-3">
                {i + 1}. {section.title}
              </h2>
              <ul className="space-y-2">
                {section.content.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 p-6 rounded-xl bg-muted/50 border">
          <h2 className="font-semibold mb-1">Questions?</h2>
          <p className="text-sm text-muted-foreground">
            Contact us at{" "}
            <a
              href="mailto:legal@bayaw.jobs"
              className="text-primary hover:underline"
            >
              legal@bayaw.jobs
            </a>{" "}
            for any questions regarding these Terms of Service.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
