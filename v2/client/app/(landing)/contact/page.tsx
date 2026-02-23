"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeroSection } from "@/components/shared/hero-section";
import { CTABanner } from "@/components/shared/cta-banner";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import Link from "next/link";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    // TODO: Submit to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection
        title="Get in Touch"
        subtitle="We're here to help. Reach out to us anytime and we'll respond as soon as possible."
      />

      {/* Contact Info Section */}
      <section className="relative container mx-auto px-4 py-20">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />

        <div className="mb-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Contact Information
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How to Reach Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10 mb-16">
          {/* Email Card */}
          <Card className="border hover:border-primary/50 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Send us an email and we&apos;ll respond within 24 hours
              </p>
              <a
                href="mailto:support@bayawjobs.com"
                className="text-primary hover:underline font-medium"
              >
                support@bayawjobs.com
              </a>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="border hover:border-primary/50 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Monday-Friday, 9am-5pm EST
              </p>
              <a
                href="tel:+15551234567"
                className="text-primary hover:underline font-medium"
              >
                +1 (555) 123-4567
              </a>
            </CardContent>
          </Card>

          {/* Office Card */}
          <Card className="border hover:border-primary/50 transition-all group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
              <p className="text-sm text-muted-foreground">
                123 Innovation Drive
                <br />
                Suite 400
                <br />
                San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto relative z-10">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    {...register("subject")}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    {...register("message")}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                    <p className="text-sm font-medium text-primary">
                      Message sent successfully! We&apos;ll get back to you
                      soon.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Links Section */}
      <section className="relative py-20 bg-gradient-to-b from-muted/30 to-background">
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
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Quick Links
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Need Help Right Away?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Link href="#" className="group">
              <Card className="border hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Help Center
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our knowledge base for answers
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="#" className="group">
              <Card className="border hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    FAQ
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find answers to common questions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="#" className="group">
              <Card className="border hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Terms of Service
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Read our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="#" className="group">
              <Card className="border hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    Privacy Policy
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how we protect your data
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-20">
        <CTABanner
          title="Prefer Live Chat?"
          description="Our team is available Monday-Friday, 9am-5pm EST to help you in real-time"
          buttonText="Start a Chat"
          buttonHref="#"
        />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
