import { JobApplication } from "@/types/job";

export const mockApplications: JobApplication[] = [
  // Senior Frontend Developer (Job 1) - 5 applications
  {
    id: "app-1",
    jobId: "1",
    candidateId: "1",
    status: "Interview",
    appliedAt: "2024-01-12",
    lastUpdated: "2024-01-18",
    rating: 4,
    notes: "Strong React experience, moving to technical interview.",
  },
  {
    id: "app-2",
    jobId: "1",
    candidateId: "6",
    status: "Screening",
    appliedAt: "2024-01-14",
    lastUpdated: "2024-01-16",
    rating: 3,
  },
  {
    id: "app-3",
    jobId: "1",
    candidateId: "5",
    status: "New",
    appliedAt: "2024-01-18",
    lastUpdated: "2024-01-18",
  },

  // Backend Developer (Job 2) - 4 applications
  {
    id: "app-4",
    jobId: "2",
    candidateId: "5",
    status: "Offer",
    appliedAt: "2024-01-10",
    lastUpdated: "2024-01-20",
    rating: 5,
    notes: "Excellent candidate, extending offer.",
  },
  {
    id: "app-5",
    jobId: "2",
    candidateId: "6",
    status: "Interview",
    appliedAt: "2024-01-11",
    lastUpdated: "2024-01-17",
    rating: 4,
  },
  {
    id: "app-6",
    jobId: "2",
    candidateId: "3",
    status: "Rejected",
    appliedAt: "2024-01-09",
    lastUpdated: "2024-01-14",
    rating: 2,
    notes: "Skills mismatch, more suited for DevOps role.",
  },

  // Product Designer (Job 3) - 3 applications
  {
    id: "app-7",
    jobId: "3",
    candidateId: "2",
    status: "Interview",
    appliedAt: "2024-01-08",
    lastUpdated: "2024-01-15",
    rating: 5,
    notes: "Outstanding portfolio, great culture fit.",
  },
  {
    id: "app-8",
    jobId: "3",
    candidateId: "4",
    status: "Screening",
    appliedAt: "2024-01-12",
    lastUpdated: "2024-01-14",
    rating: 3,
  },

  // DevOps Engineer (Job 4) - 3 applications
  {
    id: "app-9",
    jobId: "4",
    candidateId: "3",
    status: "Interview",
    appliedAt: "2024-01-14",
    lastUpdated: "2024-01-19",
    rating: 5,
    notes: "Perfect fit for the role, extensive K8s experience.",
  },
  {
    id: "app-10",
    jobId: "4",
    candidateId: "5",
    status: "Screening",
    appliedAt: "2024-01-16",
    lastUpdated: "2024-01-18",
    rating: 3,
  },

  // Data Analyst (Job 5) - 4 applications
  {
    id: "app-11",
    jobId: "5",
    candidateId: "4",
    status: "Interview",
    appliedAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    rating: 5,
    notes: "Stanford graduate, impressive SQL skills.",
  },
  {
    id: "app-12",
    jobId: "5",
    candidateId: "1",
    status: "Rejected",
    appliedAt: "2024-01-16",
    lastUpdated: "2024-01-18",
    rating: 2,
    notes: "Frontend background, not enough data experience.",
  },
  {
    id: "app-13",
    jobId: "5",
    candidateId: "8",
    status: "New",
    appliedAt: "2024-01-19",
    lastUpdated: "2024-01-19",
  },

  // Mobile Developer iOS (Job 6) - 3 applications
  {
    id: "app-14",
    jobId: "6",
    candidateId: "7",
    status: "Interview",
    appliedAt: "2024-01-05",
    lastUpdated: "2024-01-12",
    rating: 5,
    notes: "Strong SwiftUI skills, great portfolio.",
  },
  {
    id: "app-15",
    jobId: "6",
    candidateId: "1",
    status: "Screening",
    appliedAt: "2024-01-06",
    lastUpdated: "2024-01-08",
    rating: 3,
  },

  // HR Manager (Job 7) - 2 applications
  {
    id: "app-16",
    jobId: "7",
    candidateId: "10",
    status: "Hired",
    appliedAt: "2023-12-20",
    lastUpdated: "2024-01-05",
    rating: 5,
    notes: "Excellent fit, started January 15.",
  },

  // Marketing Intern (Job 8) - 5 applications
  {
    id: "app-17",
    jobId: "8",
    candidateId: "9",
    status: "Interview",
    appliedAt: "2024-01-17",
    lastUpdated: "2024-01-20",
    rating: 4,
    notes: "Enthusiastic, good social media presence.",
  },
  {
    id: "app-18",
    jobId: "8",
    candidateId: "2",
    status: "New",
    appliedAt: "2024-01-19",
    lastUpdated: "2024-01-19",
  },
  {
    id: "app-19",
    jobId: "8",
    candidateId: "4",
    status: "Screening",
    appliedAt: "2024-01-18",
    lastUpdated: "2024-01-19",
    rating: 3,
  },

  // Full Stack Developer (Job 9) - 3 applications
  {
    id: "app-20",
    jobId: "9",
    candidateId: "6",
    status: "Interview",
    appliedAt: "2024-01-19",
    lastUpdated: "2024-01-21",
    rating: 4,
  },
  {
    id: "app-21",
    jobId: "9",
    candidateId: "1",
    status: "New",
    appliedAt: "2024-01-20",
    lastUpdated: "2024-01-20",
  },
  {
    id: "app-22",
    jobId: "9",
    candidateId: "5",
    status: "New",
    appliedAt: "2024-01-20",
    lastUpdated: "2024-01-20",
  },
];

export const getApplicationsByJobId = (jobId: string): JobApplication[] => {
  return mockApplications.filter((app) => app.jobId === jobId);
};

export const getApplicationsByCandidateId = (
  candidateId: string,
): JobApplication[] => {
  return mockApplications.filter((app) => app.candidateId === candidateId);
};

export const getRecentApplications = (limit: number = 5): JobApplication[] => {
  return [...mockApplications]
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    )
    .slice(0, limit);
};

export const getApplicationsByStatus = (
  status: JobApplication["status"],
): JobApplication[] => {
  return mockApplications.filter((app) => app.status === status);
};

export const getApplicationStats = () => {
  const stats = {
    total: mockApplications.length,
    new: mockApplications.filter((a) => a.status === "New").length,
    screening: mockApplications.filter((a) => a.status === "Screening").length,
    interview: mockApplications.filter((a) => a.status === "Interview").length,
    offer: mockApplications.filter((a) => a.status === "Offer").length,
    hired: mockApplications.filter((a) => a.status === "Hired").length,
    rejected: mockApplications.filter((a) => a.status === "Rejected").length,
  };
  return stats;
};
