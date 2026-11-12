import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Hire Talent",
  "Post jobs, manage applicants and find the right people for your team on Bayaw Jobs.",
  "/hire",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
