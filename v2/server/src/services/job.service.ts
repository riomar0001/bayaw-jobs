import { location_type, employment_type, job_status } from '@/generated/prisma/enums';
import { GetAllJobsQuery } from '@/validations/job.validation';
import { jobRepository } from '@/repositories/job.repository';
import { userRepository } from '@/repositories/user.repository';
import { CompanyAdmin } from '@/types/company.type';
import { CreateJobData } from '@/types/job.type';

import { AuthorizationError, NotFoundError } from '@/utils/errors.util';

export class JobService {
  async getJobById(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    return job;
  }

  async getTopJobs() {
    return jobRepository.findTopJobs(8);
  }

  async getAllJobs(query: GetAllJobsQuery) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    return jobRepository.findAll({
      page,
      limit,
      ...(query.employment_type && { employment_type: query.employment_type as employment_type }),
      ...(query.location_type && { location_type: query.location_type as location_type }),
      ...(query.location && { location: query.location }),
      ...(query.min_salary !== undefined && { min_salary: query.min_salary }),
      ...(query.max_salary !== undefined && { max_salary: query.max_salary }),
      ...(query.search && { search: query.search }),
    });
  }

  async getPopularJobs() {
    const jobs = await jobRepository.findPopularJobs();
    return jobs.map(({ _count, ...job }) => ({
      ...job,
      applicant_count: _count.applicant_applied_job,
    }));
  }

  async getCompanyJobs(companyId: string, page: number = 1, limit: number = 10) {
    return jobRepository.findAllByCompany(companyId, page, limit);
  }

  async getCompanyJobWithApplicants(jobId: string, companyId: string) {
    const job = await jobRepository.findByIdWithApplicants(jobId, companyId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    return job;
  }

  async createJob(data: CreateJobData, userId: string, companyId: string) {
    const user = await userRepository.findById(userId, { companyAdmins: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isAuthorized =
      user.companyAdmins.some(
        (admin: CompanyAdmin) => admin.role === 'COMPANY_OWNER' || admin.can_create
      ) || user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new AuthorizationError('Only authorized company users can create job postings');
    }

    if (data.minimum_salary && data.maximum_salary) {
      const minSalary = parseFloat(data.minimum_salary);
      const maxSalary = parseFloat(data.maximum_salary);
      if (isNaN(minSalary) || isNaN(maxSalary)) {
        throw new Error('Minimum and maximum salary must be valid numbers');
      }
      if (minSalary > maxSalary) {
        throw new Error('Minimum salary cannot be greater than maximum salary');
      }
    }

    const { status, ...rest } = data;
    return jobRepository.create({
      ...rest,
      company_id: companyId,
      location_type: data.location_type,
      minimum_salary: data.minimum_salary.toString(),
      maximum_salary: data.maximum_salary.toString(),
      ...(status ? { status } : {}),
    });
  }

  async updateJobStatus(jobId: string, status: job_status, userId: string, companyId: string) {
    const existingJob = await jobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError('Job not found');
    }

    const user = await userRepository.findById(userId, { companyAdmins: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isAuthorized =
      user.companyAdmins.some(
        (admin: CompanyAdmin) => admin.role === 'COMPANY_OWNER' || admin.can_update
      ) || user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new AuthorizationError('Only authorized company users can update job postings');
    }

    return jobRepository.updateStatus(jobId, companyId, status);
  }

  async updateJob(id: string, data: Partial<CreateJobData>, userId: string, companyId: string) {
    const existingJob = await jobRepository.findById(id);
    if (!existingJob) {
      throw new NotFoundError('Job not found');
    }

    const user = await userRepository.findById(userId, { companyAdmins: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isAuthorized =
      user.companyAdmins.some(
        (admin: CompanyAdmin) => admin.role === 'COMPANY_OWNER' || admin.can_update
      ) || user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new AuthorizationError('Only authorized company users can update job postings');
    }

    if (data.minimum_salary && data.maximum_salary) {
      const minSalary = parseFloat(data.minimum_salary);
      const maxSalary = parseFloat(data.maximum_salary);
      if (isNaN(minSalary) || isNaN(maxSalary)) {
        throw new Error('Minimum and maximum salary must be valid numbers');
      }
      if (minSalary > maxSalary) {
        throw new Error('Minimum salary cannot be greater than maximum salary');
      }
    }

    const { status: updateStatus, ...updateRest } = data;
    return jobRepository.update(id, companyId, {
      ...updateRest,
      location_type: data.location_type || existingJob.location_type,
      minimum_salary: data.minimum_salary?.toString() || existingJob.minimum_salary,
      maximum_salary: data.maximum_salary?.toString() || existingJob.maximum_salary,
      ...(updateStatus ? { status: updateStatus } : {}),
    });
  }
}

export const jobService = new JobService();
export default jobService;
