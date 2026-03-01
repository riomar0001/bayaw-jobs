import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { applicantController } from '@/controllers/applicant.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { onboardingSchema } from '@/validations/applicant.validation';
import { BadRequestError } from '@/utils/errors.util';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
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
