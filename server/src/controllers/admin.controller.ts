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
}

export const adminController = new AdminController();
