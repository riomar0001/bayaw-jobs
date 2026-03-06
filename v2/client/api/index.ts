// Core
export { apiClient, ApiError } from "./client";
export { unwrapResponse, handleValidationError } from "./types";

// Types
export type {
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
  // Auth
  User,
  RegisterInput,
  LoginInput,
  VerifyAuthInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdatePasswordInput,
  LoginStep1Response,
  LoginStep2Response,
  RefreshResponse,
  LoginHistoryItem,
  // Applicant
  CareerStatus,
  ProficiencyLevel,
  ApplicationStatus,
  ApplicantProfile,
  ApplicantOnboardingInput,
  UpdateProfileInput,
  Education,
  AddEducationInput,
  Experience,
  AddExperienceInput,
  Language,
  AddLanguageInput,
  Skill,
  Resume,
  ApplyJobResponse,
  ActiveApplication,
  ApplicationStats,
  Application,
  // Jobs
  LocationType,
  JobStatus,
  Job,
  JobSummary,
  PopularJob,
  CompanyJob,
  CompanyJobApplicant,
  JobWithApplicants,
  CreateJobInput,
  UpdateJobInput,
  JobFilters,
  // Business
  CompanySummary,
  CompanyListItem,
  CompanyLocation,
  CompanySocial,
  CompanyContact,
  CompanyAdmin,
  CompanyInfo,
  PublicCompany,
  BusinessOnboardingInput,
  UpdateCompanyInfoInput,
  UpdateSocialsInput,
  UpdateContactInput,
  AddLocationInput,
  AddAdminInput,
  PipelineItem,
  DashboardData,
  BusinessApplicantDetail,
  JobStats,
  ApplicantStats,
} from "./types";

// Services
export { authService } from "./services/auth.service";
export { applicantService } from "./services/applicant.service";
export { businessService } from "./services/business.service";
export { jobsService } from "./services/jobs.service";
