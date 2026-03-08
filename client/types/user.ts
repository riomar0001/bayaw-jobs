export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName?: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  timezone?: string;
  language: string;
  notifications: NotificationSettings;
  createdAt: string;
  lastLogin: string;
}

export interface CompanyUser {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  fullName: string;
}

export type UserRole = "Admin" | "Recruiter" | "Hiring Manager" | "Viewer";

export interface NotificationSettings {
  emailNewApplicant: boolean;
  emailApplicationUpdate: boolean;
  emailWeeklySummary: boolean;
  pushNotifications: boolean;
}
