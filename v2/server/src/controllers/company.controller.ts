import { Request, Response, NextFunction } from 'express';
import { companyService } from '@/services/company.service';
import { createdResponse, successResponse } from '@/utils/apiResponse.util';
import { BadRequestError } from '@/utils/errors.util';

export class CompanyController {
  async getTopCompanies(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await companyService.getTopCompanies();
      successResponse(res, result, 'Top companies retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async onboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const company = await companyService.onboard(userId, req.body, req.file);

      createdResponse(res, company, 'Business onboarding completed successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      if (!req.file) {
        throw new BadRequestError('Logo image is required');
      }

      const result = await companyService.updateLogo(userId, req.file);

      successResponse(res, result, 'Company logo updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const companyId = req.user?.company_id;
      if (!userId || !companyId) {
        throw new Error('User ID or Company ID missing in request');
      }

      const result = await companyService.getAdmins(userId, companyId);
      successResponse(res, result, 'Company admins retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const companyId = req.user?.company_id;
      if (!userId || !companyId) {
        throw new Error('User ID or Company ID missing in request');
      }

      const admin = await companyService.addAdmin(userId, companyId, req.body);
      createdResponse(res, admin, 'Admin added successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const companyId = req.user?.company_id;
      if (!userId || !companyId) {
        throw new Error('User ID or Company ID missing in request');
      }

      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new BadRequestError('Admin ID is required');
      }

      await companyService.removeAdmin(userId, companyId, id);
      successResponse(res, null, 'Admin removed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new BadRequestError('Company ID is required');
      }

      const { buffer, contentType, filename } = await companyService.getLogo(id);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}

export const companyController = new CompanyController();
export default companyController;
