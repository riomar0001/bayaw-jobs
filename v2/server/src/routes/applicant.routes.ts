import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { applicantController } from '@/controllers/applicant.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import {
  onboardingSchema,
  updateProfileSchema,
  updateEducationSchema,
  addEducationSchema,
  addExperienceSchema,
  updateExperienceSchema,
  updateCareerStatusSchema,
  addLanguageSchema,
  updateLanguageSchema,
  addSkillsSchema,
  deleteSkillSchema,
} from '@/validations/applicant.validation';
import { BadRequestError } from '@/utils/errors.util';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
      return;
    }
    cb(null, true);
  },
});

/** Parses the stringified JSON in req.body.data into req.body for the validation middleware. */
function parseOnboardingData(req: Request, _res: Response, next: NextFunction): void {
  try {
    if (typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data) as unknown;
    }
    next();
  } catch {
    next(new BadRequestError('Invalid JSON in the "data" field'));
  }
}

router.post(
  '/onboarding',
  authenticate,
  upload.single('resume'),
  parseOnboardingData,
  validate(onboardingSchema),
  applicantController.onboard.bind(applicantController)
);

router.get('/profile', authenticate, applicantController.getProfile.bind(applicantController));

router.get(
  '/educations',
  authenticate,
  applicantController.getEducations.bind(applicantController)
);

router.get(
  '/experiences',
  authenticate,
  applicantController.getExperiences.bind(applicantController)
);

router.get(
  '/career-status',
  authenticate,
  applicantController.getCareerStatus.bind(applicantController)
);

router.patch(
  '/career-status',
  authenticate,
  validate(updateCareerStatusSchema),
  applicantController.updateCareerStatus.bind(applicantController)
);

router.get('/languages', authenticate, applicantController.getLanguages.bind(applicantController));

router.post(
  '/languages',
  authenticate,
  validate(addLanguageSchema),
  applicantController.addLanguage.bind(applicantController)
);

router.patch(
  '/languages/:id',
  authenticate,
  validate(updateLanguageSchema),
  applicantController.updateLanguage.bind(applicantController)
);

router.delete(
  '/languages/:id',
  authenticate,
  applicantController.deleteLanguage.bind(applicantController)
);

router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  applicantController.updateProfile.bind(applicantController)
);

router.post(
  '/education',
  authenticate,
  validate(addEducationSchema),
  applicantController.addEducation.bind(applicantController)
);

router.patch(
  '/education/:id',
  authenticate,
  validate(updateEducationSchema),
  applicantController.updateEducation.bind(applicantController)
);

router.delete(
  '/education/:id',
  authenticate,
  applicantController.deleteEducation.bind(applicantController)
);

router.post(
  '/experience',
  authenticate,
  validate(addExperienceSchema),
  applicantController.addExperience.bind(applicantController)
);

router.patch(
  '/experience/:id',
  authenticate,
  validate(updateExperienceSchema),
  applicantController.updateExperience.bind(applicantController)
);

router.delete(
  '/experience/:id',
  authenticate,
  applicantController.deleteExperience.bind(applicantController)
);

router.get('/skills', authenticate, applicantController.getSkills.bind(applicantController));
router.post(
  '/skills',
  authenticate,
  validate(addSkillsSchema),
  applicantController.addSkills.bind(applicantController)
);
router.delete(
  '/skills/:id',
  authenticate,
  validate(deleteSkillSchema),
  applicantController.deleteSkill.bind(applicantController)
);

router.get(
  '/applications/active',
  authenticate,
  applicantController.getActiveApplications.bind(applicantController)
);
router.get(
  '/applications/stats',
  authenticate,
  applicantController.getApplicationStats.bind(applicantController)
);
router.get(
  '/applications',
  authenticate,
  applicantController.getAllApplications.bind(applicantController)
);

router.post(
  '/jobs/:jobId/apply',
  authenticate,
  applicantController.applyToJob.bind(applicantController)
);

router.get('/resume/:id', applicantController.getResume.bind(applicantController));

router.patch(
  '/resume',
  authenticate,
  upload.single('resume'),
  applicantController.updateResume.bind(applicantController)
);

router.get('/profile/picture/:id', applicantController.getProfilePicture.bind(applicantController));

router.patch(
  '/profile/picture',
  authenticate,
  uploadImage.single('picture'),
  applicantController.updateProfilePicture.bind(applicantController)
);

export default router;
