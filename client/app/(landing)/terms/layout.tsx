import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Terms of Service",
  "The terms that apply when you use Bayaw Jobs as a job seeker or employer.",
  "/terms",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
