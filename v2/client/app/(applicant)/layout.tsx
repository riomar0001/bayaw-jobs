"use client";

import { Navbar } from "@/components/shared/navbar";
import { mockUserProfile } from "@/data";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you would get this from authentication context/state
  const profile = mockUserProfile;

  return (
    <>
      <Navbar
        isAuthenticated={true}
        userInitials={`${profile.firstName[0]}${profile.lastName[0]}`}
        userName={`${profile.firstName} ${profile.lastName}`}
      />
      {children}
    </>
  );
}
