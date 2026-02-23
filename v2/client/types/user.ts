export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  timezone?: string;
  language: string;
  notifications: NotificationSettings;
  createdAt: string;
  lastLogin: string;
}

export type UserRole = "Admin" | "Recruiter" | "Hiring Manager" | "Viewer";

export interface NotificationSettings {
  emailNewApplicant: boolean;
  emailApplicationUpdate: boolean;
  emailWeeklySummary: boolean;
  pushNotifications: boolean;
}
