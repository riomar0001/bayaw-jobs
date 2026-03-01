import { Request, Response, NextFunction } from 'express';
import { applicantService } from '@/services/applicant.service';
import { createdResponse, successResponse } from '@/utils/apiResponse.util';

export class ApplicantController {
  async onboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const profile = await applicantService.onboard(userId, req.body);

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
}

export const applicantController = new ApplicantController();
export default applicantController;
