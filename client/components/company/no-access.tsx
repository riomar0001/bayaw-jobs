import Link from "next/link";
import { Building2, ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompanyNoAccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-muted/30 to-background px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Building2 className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2">No Company Account Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You&apos;re not associated with any company on Job Tally. Create a
        hiring account to post jobs and manage applicants.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/company/register">
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Company Account
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
