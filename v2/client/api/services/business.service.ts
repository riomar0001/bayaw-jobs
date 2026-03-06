import { apiClient } from '../client';
import {
  AddAdminInput,
  AddLocationInput,
  ApiResponse,
  ApplicantStats,
  BusinessApplicantDetail,
  BusinessOnboardingInput,
  CompanyAdmin,
  CompanyContact,
  CompanyInfo,
  CompanyJob,
  CompanyListItem,
  CompanyLocation,
  CompanySocial,
  CompanySummary,
  DashboardData,
  JobStats,
  PaginatedResponse,
  PublicCompany,
  UpdateCompanyInfoInput,
  UpdateContactInput,
  UpdateSocialsInput,
  unwrapResponse,
} from '../types';

class BusinessService {
  // ── Public ───────────────────────────────────────────────────────────────────

  async getTopCompanies(): Promise<CompanySummary[]> {
    const res = await apiClient.get<ApiResponse<CompanySummary[]>>('/business/top');
    return unwrapResponse(res.data);
  }

  async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ companies: CompanyListItem[] }> {
    const res = await apiClient.get<ApiResponse<{ companies: CompanyListItem[] }>>('/business', {
      params,
    });
    return unwrapResponse(res.data);
  }

  async getPublicCompany(id: string): Promise<PublicCompany> {
    const res = await apiClient.get<ApiResponse<PublicCompany>>(`/business/${id}/public`);
    return unwrapResponse(res.data);
  }

  // ── Onboarding ───────────────────────────────────────────────────────────────

  async completeOnboarding(data: BusinessOnboardingInput): Promise<CompanyInfo> {
    const res = await apiClient.post<ApiResponse<CompanyInfo>>('/business/onboarding', data);
    return unwrapResponse(res.data);
  }

  // ── Logo ─────────────────────────────────────────────────────────────────────

  async updateLogo(file: File): Promise<{ logo: string; url: string }> {
    const form = new FormData();
    form.append('logo', file);
    const res = await apiClient.upload<ApiResponse<{ logo: string; url: string }>>(
      '/business/logo',
      form
    );
    return unwrapResponse(res.data);
  }

  /** Returns the URL to fetch the company logo */
  getLogoUrl(companyId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5090'}/business/logo/${companyId}`;
  }

  // ── Company Info ─────────────────────────────────────────────────────────────

  async getInfo(): Promise<CompanyInfo> {
    const res = await apiClient.get<ApiResponse<CompanyInfo>>('/business/info');
    return unwrapResponse(res.data);
  }

  async updateInfo(data: UpdateCompanyInfoInput): Promise<Partial<CompanyInfo>> {
    const res = await apiClient.patch<ApiResponse<Partial<CompanyInfo>>>('/business/info', data);
    return unwrapResponse(res.data);
  }

  async updateSocials(data: UpdateSocialsInput): Promise<CompanySocial[]> {
    const res = await apiClient.patch<ApiResponse<CompanySocial[]>>('/business/socials', data);
    return unwrapResponse(res.data);
  }

  async updateContact(data: UpdateContactInput): Promise<CompanyContact> {
    const res = await apiClient.patch<ApiResponse<CompanyContact>>('/business/contact', data);
    return unwrapResponse(res.data);
  }

  // ── Locations ─────────────────────────────────────────────────────────────────

  async addLocation(data: AddLocationInput): Promise<CompanyLocation> {
    const res = await apiClient.post<ApiResponse<CompanyLocation>>('/business/locations', data);
    return unwrapResponse(res.data);
  }

  async updateLocation(id: string, data: AddLocationInput): Promise<CompanyLocation> {
    const res = await apiClient.patch<ApiResponse<CompanyLocation>>(
      `/business/locations/${id}`,
      data
    );
    return unwrapResponse(res.data);
  }

  async deleteLocation(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/business/locations/${id}`);
  }

  // ── Admins ───────────────────────────────────────────────────────────────────

  async getAdmins(): Promise<{ admins: CompanyAdmin[] }> {
    const res = await apiClient.get<ApiResponse<{ admins: CompanyAdmin[] }>>('/business/admins');
    return unwrapResponse(res.data);
  }

  async addAdmin(data: AddAdminInput): Promise<CompanyAdmin> {
    const res = await apiClient.post<ApiResponse<CompanyAdmin>>('/business/admins', data);
    return unwrapResponse(res.data);
  }

  async removeAdmin(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/business/admins/${id}`);
  }

  async updateAdminProfilePicture(file: File): Promise<{ profile_picture: string; url: string }> {
    const form = new FormData();
    form.append('profile_picture', file);
    const res = await apiClient.upload<ApiResponse<{ profile_picture: string; url: string }>>(
      '/business/admins/profile-picture',
      form
    );
    return unwrapResponse(res.data);
  }

  getAdminProfilePictureUrl(userId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5090'}/business/admins/profile-picture/${userId}`;
  }

  // ── Dashboard & Stats ────────────────────────────────────────────────────────

  async getDashboard(): Promise<DashboardData> {
    const res = await apiClient.get<ApiResponse<DashboardData>>('/business/dashboard');
    return unwrapResponse(res.data);
  }

  async getJobStats(): Promise<JobStats> {
    const res = await apiClient.get<ApiResponse<JobStats>>('/business/stats/jobs');
    return unwrapResponse(res.data);
  }

  async getApplicantStats(): Promise<ApplicantStats> {
    const res = await apiClient.get<ApiResponse<ApplicantStats>>('/business/stats/applicants');
    return unwrapResponse(res.data);
  }

  // ── Applicants ───────────────────────────────────────────────────────────────

  async getApplicantByApplicationId(applicationId: string): Promise<BusinessApplicantDetail> {
    const res = await apiClient.get<ApiResponse<BusinessApplicantDetail>>(
      `/business/applicants/${applicationId}`
    );
    return unwrapResponse(res.data);
  }

  async getCompanyApplicants(params?: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
  }): Promise<PaginatedResponse<CompanyJob>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<CompanyJob>>>(
      '/jobs/company/applicants',
      { params }
    );
    return unwrapResponse(res.data);
  }
}

export const businessService = new BusinessService();
