export interface DashboardAnalytics {
  totalApplicants: number;
  totalJobs: number;
  activeJobs: number;
  newApplicantsThisWeek: number;
  applicantsByStatus: Record<string, number>;
  applicantsTrend: TrendDataPoint[];
  topPerformingJobs: JobPerformance[];
}

export interface TrendDataPoint {
  date: string;
  count: number;
  label?: string;
}

export interface JobPerformance {
  jobId: string;
  jobTitle: string;
  applicants: number;
  views: number;
  conversionRate: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}
