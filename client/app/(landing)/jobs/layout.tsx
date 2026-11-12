import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Browse Jobs",
  "Search open jobs by title, location, type and salary from companies hiring in the Philippines.",
  "/jobs",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
