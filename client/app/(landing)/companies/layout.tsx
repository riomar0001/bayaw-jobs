import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Companies Hiring",
  "Explore companies hiring now, their open positions, and what it's like to work there.",
  "/companies",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
