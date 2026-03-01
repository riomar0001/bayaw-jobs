import { Request, Response, NextFunction } from 'express';
import { applicantService } from '@/services/applicant.service';
import { createdResponse, successResponse } from '@/utils/apiResponse.util';
import { BadRequestError } from '@/utils/errors.util';

export class ApplicantController {
  async onboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      if (!req.file) {
        throw new BadRequestError('Resume is required');
      }

      const profile = await applicantService.onboard(userId, req.body, req.file);

      createdResponse(res, profile, 'Onboarding completed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const profile = await applicantService.getProfile(userId);

      successResponse(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { buffer, filename } = await applicantService.getResume(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      if (!req.file) {
        throw new BadRequestError('Resume file is required');
      }

      const resume = await applicantService.uploadResume(userId, req.file);

      createdResponse(res, resume, 'Resume uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const applicantController = new ApplicantController();
export default applicantController;
