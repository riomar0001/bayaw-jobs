// Applicant-side data
export { jobs, type Job } from "./jobs";
export { companies, type Company } from "./companies";

// Company dashboard data
export {
  mockJobs,
  getJobById,
  getActiveJobs,
  getRecentJobs,
} from "./mock-jobs";
export {
  mockCandidates,
  getCandidateById,
  getRecentCandidates,
} from "./mock-candidates";
export { mockCandidate } from "./mock-candidate";
export {
  mockCandidateSettings,
  getDefaultCandidateSettings,
  getCandidateSettings,
} from "./mock-candidate-settings";
export {
  mockApplications,
  getApplicationsByJobId,
  getApplicationsByCandidateId,
  getRecentApplications,
  getApplicationsByStatus,
  getApplicationStats,
} from "./mock-applications";
export {
  mockAnalytics,
  mockPipelineStages,
  getDashboardAnalytics,
  getPipelineStages,
  getQuickStats,
} from "./mock-analytics";
export { mockBusiness, getBusinessProfile } from "./mock-business";
export { mockUser, getCurrentUser } from "./mock-user";

// Applicant profile data
export { mockUserProfile, type UserProfile } from "./mockData";

// Candidate application data (applicant-side)
// Note: aliased to avoid conflict with employer-side mockApplications
export {
  mockApplications as candidateApplications,
  statusConfig,
  type ApplicationStatus as CandidateApplicationStatus,
  type Application as CandidateApplication,
} from "./mockApplications";
