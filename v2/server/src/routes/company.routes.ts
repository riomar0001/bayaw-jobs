import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { companyController } from '@/controllers/company.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { addAdminSchema, businessOnboardingSchema, deleteAdminSchema } from '@/validations/company.validation';
import { BadRequestError } from '@/utils/errors.util';

const router = Router();

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
  uploadImage.single('logo'),
  parseOnboardingData,
  validate(businessOnboardingSchema),
  companyController.onboard.bind(companyController)
);

router.patch(
  '/logo',
  authenticate,
  uploadImage.single('logo'),
  companyController.updateLogo.bind(companyController)
);

router.get('/logo/:id', companyController.getLogo.bind(companyController));

router.get('/admins', authenticate, companyController.getAdmins.bind(companyController));

router.post(
  '/admins',
  authenticate,
  validate(addAdminSchema),
  companyController.addAdmin.bind(companyController)
);

router.delete(
  '/admins/:id',
  authenticate,
  validate(deleteAdminSchema),
  companyController.removeAdmin.bind(companyController)
);

export default router;
