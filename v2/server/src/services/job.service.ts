import { location_type } from '@/generated/prisma/enums';
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

  async getAllJobs(page: number = 1, limit: number = 10) {
    return jobRepository.findAll(page, limit);
  }

  async createJob(data: CreateJobData) {
    const user = await userRepository.findById(data.user_id, { companyAdmins: true });
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

    return jobRepository.create({
      ...data,
      location_type: data.location_type as location_type,
      minimum_salary: data.minimum_salary.toString(),
      maximum_salary: data.maximum_salary.toString(),
    });
  }

  async updateJob(id: string, data: Partial<CreateJobData>) {
    const existingJob = await jobRepository.findById(id);
    if (!existingJob) {
      throw new NotFoundError('Job not found');
    }
    if (!data.user_id) {
      throw new Error('User ID is required to update job');
    }

    const user = await userRepository.findById(data.user_id, { companyAdmins: true });
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

    return jobRepository.update(id, {
      ...data,
      location_type: (data.location_type as location_type) || existingJob.location_type,
      minimum_salary: data.minimum_salary?.toString() || existingJob.minimum_salary,
      maximum_salary: data.maximum_salary?.toString() || existingJob.maximum_salary,
    });
  }
}

export const jobService = new JobService();
export default jobService;
