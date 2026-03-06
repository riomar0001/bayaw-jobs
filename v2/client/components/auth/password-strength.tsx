"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const results = useMemo(
    () => RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password],
  );

  const passedCount = results.filter((r) => r.passed).length;

  const strengthLabel =
    passedCount <= 1 ? "Weak"
    : passedCount <= 3 ? "Fair"
    : passedCount === 4 ? "Good"
    : "Strong";

  const strengthColor =
    passedCount <= 1 ? "bg-destructive"
    : passedCount <= 3 ? "bg-yellow-500"
    : passedCount === 4 ? "bg-blue-500"
    : "bg-green-500";

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span
            className={`font-semibold ${
              passedCount <= 1 ? "text-destructive"
              : passedCount <= 3 ? "text-yellow-500"
              : passedCount === 4 ? "text-blue-500"
              : "text-green-500"
            }`}
          >
            {strengthLabel}
          </span>
        </div>
        <div className="flex gap-1">
          {RULES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < passedCount ? strengthColor : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rule checklist */}
      <ul className="space-y-1">
        {results.map((rule) => (
          <li key={rule.label} className="flex items-center gap-2 text-xs">
            {rule.passed ? (
              <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            <span className={rule.passed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Returns true only if ALL rules pass — use to gate form submission */
export function isPasswordValid(password: string): boolean {
  return RULES.every((rule) => rule.test(password));
}
