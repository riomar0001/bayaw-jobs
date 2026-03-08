import { User } from "@/types/user";

export const mockUser: User = {
  id: "1",
  email: "admin@bayaw.com",
  firstName: "Alex",
  lastName: "Thompson",
  fullName: "Alex Thompson",
  avatar: "/avatars/alex.jpg",
  role: "Admin",
  phone: "+90 (555) 123 4567",
  timezone: "Europe/Istanbul",
  language: "en",
  notifications: {
    emailNewApplicant: true,
    emailApplicationUpdate: true,
    emailWeeklySummary: true,
    pushNotifications: false,
  },
  createdAt: "2023-01-15",
  lastLogin: "2024-01-20",
};

export const getCurrentUser = (): User => {
  return mockUser;
};
