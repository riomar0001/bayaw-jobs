import { Request, Response, NextFunction } from 'express';
import { adminService } from '@/services/admin.service';
import { banService } from '@/services/ban.service';
import { securityEventService } from '@/services/securityEvent.service';
import { successResponse } from '@/utils/apiResponse.util';
import { security_event_type, security_event_severity } from '@/generated/prisma/client';

function logAdminAction(req: Request, action: string) {
  const adminId = req.user?.user_id;
  const ip = req.ip;
  const ua = req.headers['user-agent'];
  void securityEventService.log(security_event_type.ADMIN_ACTION, {
    ...(adminId && { user_id: adminId }),
    ...(ip && { ip_address: ip }),
    ...(ua && { user_agent: ua }),
    metadata: { action, path: req.path },
  });
}

export class AdminController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getOverview();
      logAdminAction(req, 'view_overview');
      successResponse(res, data, 'Admin overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getUsers();
      logAdminAction(req, 'view_users');
      successResponse(res, data, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getBusinesses();
      logAdminAction(req, 'view_businesses');
      successResponse(res, data, 'Businesses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getApplicants();
      logAdminAction(req, 'view_applicants');
      successResponse(res, data, 'Applicants retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getJobs();
      logAdminAction(req, 'view_jobs');
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

  async banUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.user_id;
      await banService.banUser(id, adminId, req.body as { reason?: string; expires_at?: string });
      successResponse(res, null, 'User banned successfully');
    } catch (error) {
      next(error);
    }
  }

  async unbanUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.user_id;
      await banService.unbanUser(id, adminId);
      successResponse(res, null, 'User unbanned successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
