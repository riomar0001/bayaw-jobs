"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { mockUserProfile } from "@/data";
import { User, Mail, CheckCircle } from "lucide-react";

export function InformationForm() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: mockUserProfile.firstName,
    lastName: mockUserProfile.lastName,
    email: mockUserProfile.email,
    phone: mockUserProfile.phone,
    location: "San Francisco, CA, USA",
    gender: mockUserProfile.gender,
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, call API here
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              className="pl-9"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              className="pl-9"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            className="pl-9"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button type="submit">Save Changes</Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
