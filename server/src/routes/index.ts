import { Router } from 'express';
import authRoutes from './auth.routes';
import applicantRoutes from './applicant.routes';
import companyRoutes from './company.routes';
import jobRoutes from './job.routes';
import adminRoutes from './admin.routes';
import contactRoutes from './contact.routes';
import assessmentRoutes from './assessment.routes';
import assessmentAgentRoutes from './assessmentAgent.routes';

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
// BayawSec is mounted before /admin so requests don't pass through the admin router first.
router.use('/admin/assessments', assessmentRoutes);
router.use('/assessments/agent', assessmentAgentRoutes);
router.use('/admin', adminRoutes);
router.use('/contact', contactRoutes);

export default router;
