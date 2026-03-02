import { Request, Response, NextFunction } from 'express';
import { jobService } from '@/services/job.service';
import { successResponse, createdResponse } from '@/utils/apiResponse.util';
import { Config } from '@/constants/config.constant';

export class JobController {
  async getJobById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const result = await jobService.getJobById(id);
      successResponse(res, result, 'Job retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
      const result = await jobService.getAllJobs(page, limit);
      successResponse(res, result, 'Jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await jobService.createJob(req.body);
      createdResponse(res, result, 'Job created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const result = await jobService.updateJob(id, req.body);
      successResponse(res, result, 'Job updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
export default jobController;
