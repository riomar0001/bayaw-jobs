import { Navbar } from "@/components/shared/navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthFormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: "applicant" | "employer";
}

export function AuthFormLayout({
  title,
  description,
  children,
  variant = "applicant",
}: AuthFormLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <Card
          className={cn(
            "w-full max-w-md",
            variant === "employer" && "border-primary/50",
          )}
        >
          <CardHeader className="space-y-1">
            <Link href="/" className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Bayaw Jobs
              </h2>
            </Link>
            <CardTitle className="text-center">{title}</CardTitle>
            {description && (
              <CardDescription className="text-center">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </>
  );
}
