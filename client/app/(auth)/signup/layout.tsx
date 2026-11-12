import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Create Account",
  "Create a free Bayaw Jobs account to apply for jobs or start hiring.",
  "/signup",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
