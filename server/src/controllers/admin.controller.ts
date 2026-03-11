import { Request, Response, NextFunction } from 'express';
import { adminService } from '@/services/admin.service';
import { successResponse } from '@/utils/apiResponse.util';

export class AdminController {
  async getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getOverview();
      successResponse(res, data, 'Admin overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getUsers();
      successResponse(res, data, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBusinesses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getBusinesses();
      successResponse(res, data, 'Businesses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getApplicants(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getApplicants();
      successResponse(res, data, 'Applicants retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getJobs();
      successResponse(res, data, 'Jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
