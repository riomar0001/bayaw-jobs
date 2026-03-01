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

  async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const { id } = req.params as { id: string };
      await applicantService.deleteEducation(userId, id);

      successResponse(res, null, 'Education deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async addEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const created = await applicantService.addEducation(userId, req.body);

      createdResponse(res, created, 'Education added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const { id } = req.params as { id: string };
      const updated = await applicantService.updateEducation(userId, id, req.body);

      successResponse(res, updated, 'Education updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const updated = await applicantService.updateProfile(userId, req.body);

      successResponse(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new BadRequestError('Profile ID is required');
      }
      const { buffer, filename } = await applicantService.getResume(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async getProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new BadRequestError('Profile ID is required');
      }
      const { buffer, contentType, filename } = await applicantService.getProfilePicture(id);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async updateResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      if (!req.file) {
        throw new BadRequestError('Resume file is required');
      }

      const result = await applicantService.uploadResume(userId, req.file);

      successResponse(res, result, 'Resume updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      if (!req.file) {
        throw new BadRequestError('Image file is required');
      }

      const result = await applicantService.updateProfilePicture(userId, req.file);

      successResponse(res, result, 'Profile picture updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const applicantController = new ApplicantController();
export default applicantController;
