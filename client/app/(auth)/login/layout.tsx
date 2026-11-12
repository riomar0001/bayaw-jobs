import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Sign In",
  "Sign in to Bayaw Jobs to apply for jobs, track applications or manage your company's postings.",
  "/login",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
