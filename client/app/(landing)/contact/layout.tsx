import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Contact Us",
  "Get in touch with the Bayaw Jobs team for support, partnerships or feedback.",
  "/contact",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
