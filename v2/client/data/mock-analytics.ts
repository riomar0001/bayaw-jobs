import { DashboardAnalytics, PipelineStage } from "@/types/analytics";

export const mockAnalytics: DashboardAnalytics = {
  totalApplicants: 156,
  totalJobs: 10,
  activeJobs: 6,
  newApplicantsThisWeek: 23,
  applicantsByStatus: {
    New: 28,
    Screening: 35,
    Interview: 42,
    Offer: 18,
    Hired: 12,
    Rejected: 21,
  },
  applicantsTrend: [
    { date: "2024-01-01", count: 12, label: "Week 1" },
    { date: "2024-01-08", count: 18, label: "Week 2" },
    { date: "2024-01-15", count: 25, label: "Week 3" },
    { date: "2024-01-22", count: 23, label: "Week 4" },
    { date: "2024-01-29", count: 31, label: "Week 5" },
    { date: "2024-02-05", count: 28, label: "Week 6" },
    { date: "2024-02-12", count: 35, label: "Week 7" },
    { date: "2024-02-19", count: 42, label: "Week 8" },
  ],
  topPerformingJobs: [
    {
      jobId: "8",
      jobTitle: "Marketing Intern",
      applicants: 78,
      views: 2100,
      conversionRate: 3.7,
    },
    {
      jobId: "5",
      jobTitle: "Data Analyst",
      applicants: 52,
      views: 1100,
      conversionRate: 4.7,
    },
    {
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      applicants: 45,
      views: 1250,
      conversionRate: 3.6,
    },
    {
      jobId: "7",
      jobTitle: "HR Manager",
      applicants: 35,
      views: 420,
      conversionRate: 8.3,
    },
    {
      jobId: "2",
      jobTitle: "Backend Developer",
      applicants: 32,
      views: 890,
      conversionRate: 3.6,
    },
  ],
};

export const mockPipelineStages: PipelineStage[] = [
  { stage: "New", count: 28, percentage: 18, color: "hsl(var(--chart-1))" },
  {
    stage: "Screening",
    count: 35,
    percentage: 22,
    color: "hsl(var(--chart-2))",
  },
  {
    stage: "Interview",
    count: 42,
    percentage: 27,
    color: "hsl(var(--chart-3))",
  },
  { stage: "Offer", count: 18, percentage: 12, color: "hsl(var(--chart-4))" },
  { stage: "Hired", count: 12, percentage: 8, color: "hsl(var(--chart-5))" },
  { stage: "Rejected", count: 21, percentage: 13, color: "hsl(var(--muted))" },
];

export const getDashboardAnalytics = (): DashboardAnalytics => {
  return mockAnalytics;
};

export const getPipelineStages = (): PipelineStage[] => {
  return mockPipelineStages;
};

// Quick stats for dashboard cards
export const getQuickStats = () => {
  return {
    totalJobs: mockAnalytics.totalJobs,
    activeJobs: mockAnalytics.activeJobs,
    totalApplicants: mockAnalytics.totalApplicants,
    newThisWeek: mockAnalytics.newApplicantsThisWeek,
    interviewsScheduled: mockAnalytics.applicantsByStatus.Interview,
    offersExtended: mockAnalytics.applicantsByStatus.Offer,
  };
};
