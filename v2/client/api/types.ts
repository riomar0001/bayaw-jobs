import { ZodError } from "zod";
import { ApiError } from "./client";

// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string | null;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined) {
    throw new ApiError(response.message || "Request failed");
  }
  return response.data;
}

export function handleValidationError(error: ZodError): ApiError {
  const errorMap = error.issues.reduce(
    (acc, issue) => {
      const path = issue.path.join(".");
      if (!acc[path]) acc[path] = [];
      acc[path].push(issue.message);
      return acc;
    },
    {} as Record<string, string[]>,
  );
  return new ApiError(
    error.issues[0]?.message || "Validation error",
    400,
    errorMap,
  );
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyAuthInput {
  code: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  new_password: string;
  confirm_password: string;
}

export interface UpdatePasswordInput {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface LoginStep1Response {
  temp_token: string;
  expires_in: number;
}

export interface LoginStep2Response {
  access_token: string;
  user: Pick<User, "id" | "email" | "first_name" | "last_name" | "role">;
}

export interface RefreshResponse {
  accessToken: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    role: string;
  };
}

export interface LoginHistoryItem {
  id: string;
  ip_address: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string;
  last_used: string | null;
  revoked_at: string | null;
  expires_at: string;
}

// ─── Applicant ───────────────────────────────────────────────────────────────

export type CareerStatus =
  | "ACTIVELY_LOOKING"
  | "OPEN_TO_OPPORTUNITIES"
  | "EMPLOYED_NOT_LOOKING"
  | "NOT_LOOKING";

export type ProficiencyLevel = "BASIC" | "CONVERSATIONAL" | "FLUENT" | "NATIVE";

export type ApplicationStatus =
  | "NEW"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "HIRED"
  | "CANCELLED";

export interface Education {
  id: string;
  applicant_profile_id: string;
  institution_name: string;
  field_of_study: string;
  start_year: number;
  end_year: number | null;
}

export interface Experience {
  id: string;
  applicant_profile_id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

export interface Language {
  id: string;
  applicant_profile_id: string;
  language_name: string;
  proficiency_level: ProficiencyLevel;
}

export interface Skill {
  id: string;
  skill_name: string;
}

export interface Resume {
  id: string;
  applicant_profile_id: string;
  file_name: string;
  url: string;
}

export interface ApplicantProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  gender: string;
  desired_position: string;
  location: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  career_status?: CareerStatus | null;
  created_at: string;
  updated_at: string;
  applicantEducations?: Education[];
  applicantExperiences?: Experience[];
  applicantLanguages?: Language[];
  applicantSkills?: Skill[];
}

export interface ApplicantOnboardingInput {
  profile: {
    age: number;
    gender: string;
    desired_position: string;
    location: string;
    career_status?: CareerStatus;
  };
  education?: Array<{
    institution_name: string;
    field_of_study: string;
    start_year: number;
    end_year?: number | null;
  }>;
  experience?: Array<{
    company_name: string;
    position: string;
    start_date: string;
    is_current: boolean;
    end_date?: string | null;
  }>;
  skills: string[];
  languages: Array<{
    language_name: string;
    proficiency_level: ProficiencyLevel;
  }>;
}

export interface UpdateProfileInput {
  desired_position?: string;
  age?: number;
  location?: string;
  gender?: string;
}

export interface AddEducationInput {
  institution_name: string;
  field_of_study: string;
  start_year: number;
  end_year?: number | null;
}

export interface AddExperienceInput {
  company_name: string;
  position: string;
  start_date: string;
  is_current: boolean;
  end_date?: string | null;
}

export interface AddLanguageInput {
  language_name: string;
  proficiency_level: ProficiencyLevel;
}

export interface ApplyJobResponse {
  id: string;
  status: "NEW";
  application_date: string;
  job: {
    id: string;
    title: string;
    department: string;
    company_id: string;
  };
}

export interface ActiveApplication {
  id: string;
  status: ApplicationStatus;
  application_date: string;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    company_id: string;
  };
}

export interface ApplicationStats {
  total: number;
  NEW: number;
  SCREENING: number;
  INTERVIEW: number;
  OFFER: number;
  REJECTED: number;
  HIRED: number;
  CANCELLED: number;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  application_date: string;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    employment_type: string;
    location_type: LocationType;
    company_id: string;
  };
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export type LocationType = "ONSITE" | "REMOTE" | "HYBRID";
export type JobStatus = "OPEN" | "CLOSED" | "PAUSED";

export interface Job {
  id: string;
  company_id: string;
  title: string;
  department: string;
  location: string;
  location_type: LocationType;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface JobSummary {
  id: string;
  company_id: string;
  title: string;
  department: string;
  location: string;
  location_type: LocationType;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  status: JobStatus;
  created_at: string;
}

export interface PopularJob extends JobSummary {
  applicant_count: number;
}

export interface CompanyJob {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  location_type: LocationType;
  status: JobStatus;
  applicant_count: number;
  created_at: string;
}

export interface CompanyJobApplicant {
  id: string;
  status: ApplicationStatus;
  application_date: string;
  applicant_profile: {
    first_name: string;
    last_name: string;
    desired_position: string;
    profile_picture: string | null;
  };
  job: {
    title: string;
    department: string;
  };
}

export interface JobWithApplicants extends Job {
  applicant_applied_job: Array<{
    id: string;
    status: ApplicationStatus;
    application_date: string;
    applicant_profile: {
      first_name: string;
      last_name: string;
      desired_position: string;
      profile_picture: string | null;
    };
  }>;
}

export interface CreateJobInput {
  title: string;
  department: string;
  location: string;
  location_type: LocationType;
  employment_type: string;
  minimum_salary: string;
  maximum_salary: string;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  status?: JobStatus;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  location_type?: LocationType;
  employment_type?: string;
  location?: string;
  min_salary?: number;
  max_salary?: number;
  status?: JobStatus;
}

// ─── Business ────────────────────────────────────────────────────────────────

export interface CompanySummary {
  id: string;
  company_name: string;
  industry: string;
  company_size: string;
  logo: string | null;
  website: string;
  open_jobs_count: number;
}

export interface CompanyListItem {
  id: string;
  company_name: string;
  industry: string;
  company_size: string;
  about: string;
  website: string;
  logo_url: string | null;
  open_positions: number;
  companyLocations: CompanyLocation[];
}

export interface CompanyLocation {
  id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_headquarter: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanySocial {
  id: string;
  platform: "FACEBOOK" | "TWITTER" | "LINKEDIN" | "INSTAGRAM";
  url: string;
}

export interface CompanyContact {
  id: string;
  email: string;
  phone: string;
}

export interface CompanyAdmin {
  id: string;
  company_id: string;
  user_id: string;
  role: string;
  position: string | null;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: string;
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  foundation_year: number;
  website: string;
  logo: string | null;
  logo_url: string | null;
  contact: CompanyContact | null;
  companyLocations: CompanyLocation[];
  companySocials: CompanySocial[];
}

export interface PublicCompany {
  id: string;
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  website: string;
  logo_url: string | null;
  open_positions: number;
  companyLocations: CompanyLocation[];
  companySocials: CompanySocial[];
}

export interface BusinessOnboardingInput {
  company_name: string;
  industry: string;
  about: string;
  company_size: string;
  foundation_year: number;
  website: string;
  locations: Array<{
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    is_headquarter: boolean;
  }>;
  contact: {
    email: string;
    phone: string;
  };
}

export interface UpdateCompanyInfoInput {
  company_name?: string;
  industry?: string;
  about?: string;
  company_size?: string;
  foundation_year?: number;
  website?: string;
}

export interface UpdateSocialsInput {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface UpdateContactInput {
  email: string;
  phone: string;
}

export interface AddLocationInput {
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_headquarter: boolean;
}

export interface AddAdminInput {
  user_id: string;
  role: string;
  position?: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface PipelineItem {
  status: ApplicationStatus;
  count: number;
  percentage: number;
}

export interface DashboardData {
  summary: {
    total_jobs: number;
    total_applicants: number;
    new_applicants_this_week: number;
    interviewed_applicants: number;
  };
  application_pipeline: PipelineItem[];
  recent_jobs: Array<{
    id: string;
    title: string;
    department: string;
    status: JobStatus;
    applicant_count: number;
    created_at: string;
  }>;
  recent_applicants: Array<{
    id: string;
    status: ApplicationStatus;
    application_date: string;
    applicant_profile: {
      first_name: string;
      last_name: string;
      desired_position: string;
      profile_picture: string | null;
    };
    job: { title: string; department: string };
  }>;
}

export interface BusinessApplicantDetail {
  application: {
    id: string;
    status: ApplicationStatus;
    application_date: string;
    job: {
      id: string;
      title: string;
      department: string;
    };
  };
  applicant: ApplicantProfile;
}

export interface JobStats {
  total_jobs: number;
  active_jobs: number;
  closed_jobs: number;
  total_applicants: number;
}

export interface ApplicantStats {
  total_applicants: number;
  in_interview: number;
  hired: number;
  rejected: number;
}
