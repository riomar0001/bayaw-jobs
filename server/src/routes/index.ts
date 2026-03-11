import { Router } from 'express';
import authRoutes from './auth.routes';
import applicantRoutes from './applicant.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Health check
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/applicants', applicantRoutes);
router.use('/business', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/admin', adminRoutes);

export default router;
