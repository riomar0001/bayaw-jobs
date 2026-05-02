import { Request, Response, NextFunction } from 'express';
import { adminService } from '@/services/admin.service';
import { securityEventService } from '@/services/securityEvent.service';
import { successResponse } from '@/utils/apiResponse.util';
import { security_event_type, security_event_severity } from '@/generated/prisma/client';

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

  async getSecurityEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, severity, user_id, from, to, page, limit } = req.query;
      const data = await securityEventService.getEvents({
        ...(type     && { type:     type as security_event_type }),
        ...(severity && { severity: severity as security_event_severity }),
        ...(user_id  && { user_id:  user_id as string }),
        ...(from     && { from:     new Date(from as string) }),
        ...(to       && { to:       new Date(to as string) }),
        ...(page     && { page:     Number(page) }),
        ...(limit    && { limit:    Number(limit) }),
      });
      successResponse(res, data, 'Security events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSecurityStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await securityEventService.getStats();
      successResponse(res, data, 'Security stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
