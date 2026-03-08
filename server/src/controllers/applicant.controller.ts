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

  async getEducations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const educations = await applicantService.getEducations(userId);
      successResponse(res, educations, 'Educations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const experiences = await applicantService.getExperiences(userId);
      successResponse(res, experiences, 'Experiences retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCareerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const result = await applicantService.getCareerStatus(userId);
      successResponse(res, result, 'Career status retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCareerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const result = await applicantService.updateCareerStatus(userId, req.body);
      successResponse(res, result, 'Career status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const languages = await applicantService.getLanguages(userId);
      successResponse(res, languages, 'Languages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const created = await applicantService.addLanguage(userId, req.body);
      createdResponse(res, created, 'Language added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const { id } = req.params as { id: string };
      const updated = await applicantService.updateLanguage(userId, id, req.body);
      successResponse(res, updated, 'Language updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const { id } = req.params as { id: string };
      await applicantService.deleteLanguage(userId, id);
      successResponse(res, null, 'Language deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async addExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const created = await applicantService.addExperience(userId, req.body);

      createdResponse(res, created, 'Experience added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const { id } = req.params as { id: string };
      const updated = await applicantService.updateExperience(userId, id, req.body);

      successResponse(res, updated, 'Experience updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        throw new Error('User ID missing in request');
      }

      const { id } = req.params as { id: string };
      await applicantService.deleteExperience(userId, id);

      successResponse(res, null, 'Experience deleted successfully');
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
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
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

  async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      const result = await applicantService.getSkills(userId);
      successResponse(res, result, 'Skills retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      const result = await applicantService.addSkills(userId, req.body);
      createdResponse(res, result, 'Skills added successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      await applicantService.deleteSkill(userId, req.params.id as string);
      successResponse(res, null, 'Skill deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getActiveApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      const result = await applicantService.getActiveApplications(userId);
      successResponse(res, result, 'Active applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getApplicationStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');
      const result = await applicantService.getApplicationStats(userId);
      successResponse(res, result, 'Application stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const parsedPage = parseInt(req.query.page as string, 10);
      const page = Math.max(Number.isNaN(parsedPage) ? 1 : parsedPage, 1);

      const parsedLimit = parseInt(req.query.limit as string, 10);
      const limit = Math.min(Math.max(Number.isNaN(parsedLimit) ? 4 : parsedLimit, 1), 100);

      const result = await applicantService.getAllApplications(userId, page, limit);
      successResponse(res, result, 'Applications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async applyToJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.user_id;
      if (!userId) throw new Error('User ID missing in request');

      const jobId = req.params.jobId as string;
      if (!jobId) throw new BadRequestError('Job ID is required');

      const result = await applicantService.applyToJob(userId, jobId);
      createdResponse(res, result, 'Application submitted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const applicantController = new ApplicantController();
export default applicantController;
