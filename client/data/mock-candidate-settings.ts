import { CandidateSettings } from "@/types/candidate-settings";

export const mockCandidateSettings: Record<string, CandidateSettings> = {
  "1": {
    candidateId: "1",
    notifications: {
      jobAlerts: true,
      applicationUpdates: true,
      weeklyDigest: true,
      emailNotifications: true,
      pushNotifications: false,
    },
    privacy: {
      profileVisibility: "recruiters-only",
      showSalary: true,
      showContact: true,
      allowMessages: true,
    },
    account: {
      linkedInConnected: true,
      twoFactorEnabled: false,
    },
  },
  "2": {
    candidateId: "2",
    notifications: {
      jobAlerts: true,
      applicationUpdates: true,
      weeklyDigest: false,
      emailNotifications: true,
      pushNotifications: true,
    },
    privacy: {
      profileVisibility: "public",
      showSalary: false,
      showContact: true,
      allowMessages: true,
    },
    account: {
      linkedInConnected: true,
      twoFactorEnabled: true,
    },
  },
};

export const getDefaultCandidateSettings = (
  candidateId: string,
): CandidateSettings => ({
  candidateId,
  notifications: {
    jobAlerts: true,
    applicationUpdates: true,
    weeklyDigest: true,
    emailNotifications: true,
    pushNotifications: false,
  },
  privacy: {
    profileVisibility: "recruiters-only",
    showSalary: true,
    showContact: true,
    allowMessages: true,
  },
  account: {
    linkedInConnected: false,
    twoFactorEnabled: false,
  },
});

export const getCandidateSettings = (
  candidateId: string,
): CandidateSettings => {
  return (
    mockCandidateSettings[candidateId] ||
    getDefaultCandidateSettings(candidateId)
  );
};
