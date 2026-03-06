import { apiClient } from '../client';
import {
  ActiveApplication,
  AddEducationInput,
  AddExperienceInput,
  AddLanguageInput,
  ApiResponse,
  Application,
  ApplicationStats,
  ApplicantOnboardingInput,
  ApplicantProfile,
  ApplyJobResponse,
  CareerStatus,
  Education,
  Experience,
  Language,
  PaginatedResponse,
  Resume,
  Skill,
  UpdateProfileInput,
  unwrapResponse,
} from '../types';

class ApplicantService {
  // ── Onboarding ──────────────────────────────────────────────────────────────

  async completeOnboarding(data: ApplicantOnboardingInput): Promise<ApplicantProfile> {
    const res = await apiClient.post<ApiResponse<ApplicantProfile>>('/applicants/onboarding', data);
    return unwrapResponse(res.data);
  }

  // ── Profile ──────────────────────────────────────────────────────────────────

  async getProfile(): Promise<ApplicantProfile> {
    const res = await apiClient.get<ApiResponse<ApplicantProfile>>('/applicants/profile');
    return unwrapResponse(res.data);
  }

  async updateProfile(data: UpdateProfileInput): Promise<ApplicantProfile> {
    const res = await apiClient.patch<ApiResponse<ApplicantProfile>>('/applicants/profile', data);
    return unwrapResponse(res.data);
  }

  async getCareerStatus(): Promise<{ career_status: CareerStatus | null }> {
    const res = await apiClient.get<ApiResponse<{ career_status: CareerStatus | null }>>(
      '/applicants/career-status'
    );
    return unwrapResponse(res.data);
  }

  async updateCareerStatus(career_status: CareerStatus): Promise<{ career_status: CareerStatus }> {
    const res = await apiClient.patch<ApiResponse<{ career_status: CareerStatus }>>(
      '/applicants/career-status',
      { career_status }
    );
    return unwrapResponse(res.data);
  }

  async updateProfilePicture(file: File): Promise<{ profile_picture: string; url: string }> {
    const form = new FormData();
    form.append('profile_picture', file);
    const res = await apiClient.upload<ApiResponse<{ profile_picture: string; url: string }>>(
      '/applicants/profile/picture',
      form
    );
    return unwrapResponse(res.data);
  }

  /** Returns the URL to fetch profile picture — use directly as <img src> */
  getProfilePictureUrl(profileId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5090'}/applicants/profile/picture/${profileId}`;
  }

  // ── Education ────────────────────────────────────────────────────────────────

  async getEducations(): Promise<Education[]> {
    const res = await apiClient.get<ApiResponse<Education[]>>('/applicants/educations');
    return unwrapResponse(res.data);
  }

  async addEducation(data: AddEducationInput): Promise<Education> {
    const res = await apiClient.post<ApiResponse<Education>>('/applicants/education', data);
    return unwrapResponse(res.data);
  }

  async updateEducation(id: string, data: AddEducationInput): Promise<Education> {
    const res = await apiClient.patch<ApiResponse<Education>>(
      `/applicants/education/${id}`,
      data
    );
    return unwrapResponse(res.data);
  }

  async deleteEducation(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/applicants/education/${id}`);
  }

  // ── Experience ───────────────────────────────────────────────────────────────

  async getExperiences(): Promise<Experience[]> {
    const res = await apiClient.get<ApiResponse<Experience[]>>('/applicants/experiences');
    return unwrapResponse(res.data);
  }

  async addExperience(data: AddExperienceInput): Promise<Experience> {
    const res = await apiClient.post<ApiResponse<Experience>>('/applicants/experience', data);
    return unwrapResponse(res.data);
  }

  async updateExperience(id: string, data: AddExperienceInput): Promise<Experience> {
    const res = await apiClient.patch<ApiResponse<Experience>>(
      `/applicants/experience/${id}`,
      data
    );
    return unwrapResponse(res.data);
  }

  async deleteExperience(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/applicants/experience/${id}`);
  }

  // ── Languages ────────────────────────────────────────────────────────────────

  async getLanguages(): Promise<Language[]> {
    const res = await apiClient.get<ApiResponse<Language[]>>('/applicants/languages');
    return unwrapResponse(res.data);
  }

  async addLanguage(data: AddLanguageInput): Promise<Language> {
    const res = await apiClient.post<ApiResponse<Language>>('/applicants/languages', data);
    return unwrapResponse(res.data);
  }

  async updateLanguage(id: string, data: AddLanguageInput): Promise<Language> {
    const res = await apiClient.patch<ApiResponse<Language>>(
      `/applicants/languages/${id}`,
      data
    );
    return unwrapResponse(res.data);
  }

  async deleteLanguage(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/applicants/languages/${id}`);
  }

  // ── Skills ───────────────────────────────────────────────────────────────────

  async getSkills(): Promise<Skill[]> {
    const res = await apiClient.get<ApiResponse<Skill[]>>('/applicants/skills');
    return unwrapResponse(res.data);
  }

  async addSkills(skills: string[]): Promise<Skill[]> {
    const res = await apiClient.post<ApiResponse<Skill[]>>('/applicants/skills', { skills });
    return unwrapResponse(res.data);
  }

  async deleteSkill(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/applicants/skills/${id}`);
  }

  // ── Resume ───────────────────────────────────────────────────────────────────

  async updateResume(file: File): Promise<Resume> {
    const form = new FormData();
    form.append('resume', file);
    const res = await apiClient.upload<ApiResponse<Resume>>('/applicants/resume', form);
    return unwrapResponse(res.data);
  }

  /** Returns the URL to fetch resume — use for download links */
  getResumeUrl(profileId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5090'}/applicants/resume/${profileId}`;
  }

  // ── Applications ─────────────────────────────────────────────────────────────

  async applyToJob(jobId: string): Promise<ApplyJobResponse> {
    const res = await apiClient.post<ApiResponse<ApplyJobResponse>>(
      `/applicants/jobs/${jobId}/apply`
    );
    return unwrapResponse(res.data);
  }

  async getActiveApplications(): Promise<ActiveApplication[]> {
    const res = await apiClient.get<ApiResponse<ActiveApplication[]>>(
      '/applicants/applications/active'
    );
    return unwrapResponse(res.data);
  }

  async getApplicationStats(): Promise<ApplicationStats> {
    const res = await apiClient.get<ApiResponse<ApplicationStats>>(
      '/applicants/applications/stats'
    );
    return unwrapResponse(res.data);
  }

  async getApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Application>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Application>>>(
      '/applicants/applications',
      { params }
    );
    return unwrapResponse(res.data);
  }
}

export const applicantService = new ApplicantService();
