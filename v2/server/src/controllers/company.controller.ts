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

  async getAllCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
      const industry = req.query.industry ? String(req.query.industry) : undefined;
      const company_size = req.query.company_size ? String(req.query.company_size) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await companyService.getAllCompanies({
        page,
        limit,
        ...(industry !== undefined && { industry }),
        ...(company_size !== undefined && { company_size }),
        ...(search !== undefined && { search }),
      });
      successResponse(res, result, 'Companies retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPublicCompanyInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new BadRequestError('Company ID is required');
      const result = await companyService.getPublicCompanyInfo(id);
      successResponse(res, result, 'Company info retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCompanyInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.getCompanyInfo(companyId);
      successResponse(res, result, 'Company info retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCompanyInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.updateCompanyInfo(companyId, req.body);
      successResponse(res, result, 'Company info updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSocialLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.updateSocialLinks(companyId, req.body);
      successResponse(res, result, 'Social links updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.updateContact(companyId, req.body);
      successResponse(res, result, 'Contact info updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async addLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.addLocation(companyId, req.body);
      createdResponse(res, result, 'Location added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      const result = await companyService.updateLocation(companyId, req.params.id as string, req.body);
      successResponse(res, result, 'Location updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) throw new Error('Company ID missing in request');
      await companyService.deleteLocation(companyId, req.params.id as string);
      successResponse(res, null, 'Location deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getApplicantInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID missing in request');
      }

      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new BadRequestError('Application ID is required');
      }

      const result = await companyService.getApplicantInfo(id, companyId);
      successResponse(res, result, 'Applicant info retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID missing in request');
      }

      const result = await companyService.getDashboard(companyId);
      successResponse(res, result, 'Dashboard data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getJobPostingStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID missing in request');
      }

      const result = await companyService.getJobPostingStats(companyId);
      successResponse(res, result, 'Job posting stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getApplicantStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.company_id;
      if (!companyId) {
        throw new Error('Company ID missing in request');
      }

      const result = await companyService.getApplicantStats(companyId);
      successResponse(res, result, 'Applicant stats retrieved successfully');
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
