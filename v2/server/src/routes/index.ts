import { Router } from 'express';
import authRoutes from './auth.routes';
import applicantRoutes from './applicant.routes';
import companyRoutes from './company.routes';

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

export default router;
