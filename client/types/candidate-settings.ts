export interface CandidateSettings {
  candidateId: string;
  notifications: CandidateNotificationSettings;
  privacy: CandidatePrivacySettings;
  account: CandidateAccountSettings;
}

export interface CandidateNotificationSettings {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  weeklyDigest: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface CandidatePrivacySettings {
  profileVisibility: ProfileVisibility;
  showSalary: boolean;
  showContact: boolean;
  allowMessages: boolean;
}

export type ProfileVisibility = "public" | "recruiters-only" | "private";

export interface CandidateAccountSettings {
  linkedInConnected: boolean;
  twoFactorEnabled: boolean;
}
