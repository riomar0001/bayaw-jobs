import { Router } from 'express';
import { adminController } from '@/controllers/admin.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', adminController.getOverview.bind(adminController));

export default router;
