"use client";

import { Navbar } from "@/components/shared/navbar";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
