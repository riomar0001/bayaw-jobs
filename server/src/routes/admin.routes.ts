import { Router } from 'express';
import { adminController } from '@/controllers/admin.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', adminController.getOverview.bind(adminController));
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/businesses', adminController.getBusinesses.bind(adminController));
router.get('/applicants', adminController.getApplicants.bind(adminController));
router.get('/jobs', adminController.getJobs.bind(adminController));

export default router;
