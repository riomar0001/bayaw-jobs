import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  return (
    <div
      role="note"
      aria-label="Demo notice"
      className="bg-amber-100 text-amber-950 border-b border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-900"
    >
      <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 text-xs sm:items-center sm:text-sm">
        <FlaskConical className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">This project is for demo purposes only.</strong>{" "}
          All data resets to sample data every day at 12:00 AM (PHT), emails are
          never actually sent, and each account has daily activity limits. Don&apos;t
          enter real personal information.
        </span>
      </p>
    </div>
  );
}
