export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: LocationType;
  employmentType: EmploymentType;
  salaryRange: SalaryRange;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  closingDate?: string;
  applicantCount: number;
  viewCount: number;
}

export type LocationType = "Remote" | "Onsite" | "Hybrid";

export type EmploymentType =
  | "Fulltime"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship";

export type JobStatus = "Draft" | "Active" | "Paused" | "Closed";

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  lastUpdated: string;
  notes?: string;
  rating?: number;
}

export type ApplicationStatus =
  | "New"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export interface JobWithApplications extends Job {
  applications: JobApplication[];
}
