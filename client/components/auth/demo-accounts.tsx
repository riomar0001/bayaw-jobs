import { Building2, ShieldCheck, UserRound } from "lucide-react";

// Published demo logins; they exist in the seed data and come back after every nightly reset.
const DEMO_ACCOUNTS = [
  {
    role: "Applicant",
    description: "Browse jobs, apply and track applications",
    email: "kathleen.reyes@gmail.com",
    password: "Test@1234",
    icon: UserRound,
  },
  {
    role: "Company owner",
    description: "Post jobs and manage applicants",
    email: "owner@techcorp.com",
    password: "Test@1234",
    icon: Building2,
  },
  {
    role: "Admin",
    description: "Users, companies, queues and security",
    email: "admin@bayaw.com",
    password: "Admin@1234",
    icon: ShieldCheck,
  },
] as const;

interface DemoAccountsProps {
  onSelect: (email: string, password: string) => void;
}

export function DemoAccounts({ onSelect }: DemoAccountsProps) {
  return (
    <section aria-labelledby="demo-accounts-heading" className="space-y-3 rounded-lg border border-dashed p-4">
      <div>
        <h2 id="demo-accounts-heading" className="text-sm font-semibold">
          Demo accounts
        </h2>
        <p className="text-xs text-muted-foreground">
          Pick one to fill in the form, then sign in.
        </p>
      </div>
      <ul className="space-y-2">
        {DEMO_ACCOUNTS.map(({ role, description, email, password, icon: Icon }) => (
          <li key={email}>
            <button
              type="button"
              onClick={() => onSelect(email, password)}
              className="flex w-full items-center gap-3 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{role}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {email} · {password}
                </span>
                <span className="sr-only">. {description}</span>
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">{description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
