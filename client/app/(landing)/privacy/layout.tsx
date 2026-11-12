import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy",
  "How Bayaw Jobs collects, uses and protects your personal information.",
  "/privacy",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
