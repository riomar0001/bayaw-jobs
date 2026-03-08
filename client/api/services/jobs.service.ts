import { apiClient } from "../client";
import {
  ApiResponse,
  CompanyJob,
  CompanyJobApplicant,
  CreateJobInput,
  Job,
  JobFilters,
  JobStatus,
  JobSummary,
  JobWithApplicants,
  PaginatedResponse,
  PopularJob,
  UpdateJobInput,
  unwrapResponse,
} from "../types";

class JobsService {
  // ── Public ───────────────────────────────────────────────────────────────────

  async getTopJobs(): Promise<JobSummary[]> {
    const res = await apiClient.get<ApiResponse<JobSummary[]>>("/jobs/top");
    return unwrapResponse(res.data);
  }

  async getJobs(filters?: JobFilters): Promise<PaginatedResponse<JobSummary>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<JobSummary>>>(
      "/jobs",
      {
        params: filters,
      },
    );
    return unwrapResponse(res.data);
  }

  async getPopularJobs(): Promise<PopularJob[]> {
    const res = await apiClient.get<ApiResponse<PopularJob[]>>("/jobs/popular");
    return unwrapResponse(res.data);
  }

  async getJob(id: string): Promise<Job> {
    const res = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return unwrapResponse(res.data);
  }

  // ── Company (authenticated) ──────────────────────────────────────────────────

  async getCompanyJobs(params?: {
    page?: number;
    limit?: number;
    status?: JobStatus;
  }): Promise<PaginatedResponse<CompanyJob>> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<CompanyJob>>>(
      "/jobs/company",
      {
        params,
      },
    );
    return unwrapResponse(res.data);
  }

  async getCompanyApplicants(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<CompanyJobApplicant>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<CompanyJobApplicant>>
    >("/jobs/company/applicants", { params });
    return unwrapResponse(res.data);
  }

  async getCompanyJob(id: string): Promise<JobWithApplicants> {
    const res = await apiClient.get<ApiResponse<JobWithApplicants>>(
      `/jobs/company/${id}`,
    );
    return unwrapResponse(res.data);
  }

  async createJob(data: CreateJobInput): Promise<Job> {
    const res = await apiClient.post<ApiResponse<Job>>("/jobs/create", data);
    return unwrapResponse(res.data);
  }

  async updateJob(id: string, data: UpdateJobInput): Promise<Job> {
    const res = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return unwrapResponse(res.data);
  }

  async updateJobStatus(id: string, status: JobStatus): Promise<Job> {
    const res = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/status`, {
      status,
    });
    return unwrapResponse(res.data);
  }
}

export const jobsService = new JobsService();
