import { Router } from 'express';
import { applicantController } from '@/controllers/applicant.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { onboardingSchema } from '@/validations/applicant.validation';

const router = Router();

router.post(
  '/onboarding',
  authenticate,
  validate(onboardingSchema),
  applicantController.onboard.bind(applicantController)
);

router.get('/profile', authenticate, applicantController.getProfile.bind(applicantController));

export default router;
