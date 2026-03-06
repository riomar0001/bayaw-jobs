import { Request, Response, NextFunction } from 'express';
import { jobService } from '@/services/job.service';
import { applicantService } from '@/services/applicant.service';
import { successResponse, createdResponse } from '@/utils/apiResponse.util';
import { Config } from '@/constants/config.constant';

export class JobController {
  async getTopJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await jobService.getTopJobs();
      successResponse(res, result, 'Top jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const applicantProfileId = req.user?.applicant_profile_id;
      const result = await jobService.getJobById(id, applicantProfileId);
      successResponse(res, result, 'Job retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await jobService.getAllJobs(req.query as Record<string, string>);
      successResponse(res, result, 'Jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPopularJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await jobService.getPopularJobs();
      successResponse(res, result, 'Popular jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCompanyJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const parsedPage = parseInt(req.query.page as string, 10);
      const page = Math.max(
        Number.isNaN(parsedPage) ? Config.PAGINATION.DEFAULT_PAGE : parsedPage,
        1
      );

      const parsedLimit = parseInt(req.query.limit as string, 10);
      const limit = Math.min(
        Math.max(Number.isNaN(parsedLimit) ? Config.PAGINATION.DEFAULT_LIMIT : parsedLimit, 1),
        Config.PAGINATION.MAX_LIMIT
      );

      const result = await jobService.getCompanyJobs(companyId, page, limit);
      successResponse(res, result, 'Company jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCompanyJobById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      const result = await jobService.getCompanyJobWithApplicants(req.params.id, companyId);
      successResponse(res, result, 'Job retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCompanyApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID is required');

      const parsedPage = parseInt(req.query.page as string, 10);
      const page = Math.max(
        Number.isNaN(parsedPage) ? Config.PAGINATION.DEFAULT_PAGE : parsedPage,
        1
      );

      const parsedLimit = parseInt(req.query.limit as string, 10);
      const limit = Math.min(
        Math.max(Number.isNaN(parsedLimit) ? Config.PAGINATION.DEFAULT_LIMIT : parsedLimit, 1),
        Config.PAGINATION.MAX_LIMIT
      );

      const result = await applicantService.getCompanyApplicants(companyId, page, limit);
      successResponse(res, result, 'Company applicants retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new Error('User ID is required to create a job');
      }

      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID is required to create a job');
      }
      const result = await jobService.createJob(req.body, userId, companyId);
      createdResponse(res, result, 'Job created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateJobStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID is required');

      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID is required');

      const result = await jobService.updateJobStatus(
        req.params.id,
        req.body.status,
        userId,
        companyId
      );
      successResponse(res, result, 'Job status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID is required to update a job');
      }

      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID is required to update a job');
      }

      const result = await jobService.updateJob(id, req.body, userId, companyId);
      successResponse(res, result, 'Job updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
export default jobController;
