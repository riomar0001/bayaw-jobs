import { Router } from 'express';
import { adminController } from '@/controllers/admin.controller';
import { queueController } from '@/controllers/queue.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

// ── Entity overview ──────────────────────────────────────────────────────────
router.get('/overview', adminController.getOverview.bind(adminController));
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/businesses', adminController.getBusinesses.bind(adminController));
router.get('/applicants', adminController.getApplicants.bind(adminController));
router.get('/jobs', adminController.getJobs.bind(adminController));

// ── User moderation ──────────────────────────────────────────────────────────
router.patch('/users/:id/ban', adminController.banUser.bind(adminController));
router.patch('/users/:id/unban', adminController.unbanUser.bind(adminController));

// ── Security events ──────────────────────────────────────────────────────────
router.get('/security-events/stats', adminController.getSecurityStats.bind(adminController));
router.get('/security-events', adminController.getSecurityEvents.bind(adminController));

// ── Queue management ─────────────────────────────────────────────────────────
router.get('/queues', queueController.getAllQueues.bind(queueController));
router.get('/queues/:queue/jobs', queueController.getJobs.bind(queueController));
router.get('/queues/:queue/dlq', queueController.getDlqJobs.bind(queueController));
router.post('/queues/:queue/pause', queueController.pauseQueue.bind(queueController));
router.post('/queues/:queue/resume', queueController.resumeQueue.bind(queueController));
router.post('/queues/:queue/drain', queueController.drainQueue.bind(queueController));
router.post('/queues/:queue/dlq/retry-all', queueController.retryAllDlq.bind(queueController));
router.delete('/queues/:queue/dlq/clear', queueController.clearDlq.bind(queueController));
router.post('/queues/:queue/jobs/:jobId/retry', queueController.retryJob.bind(queueController));
router.delete('/queues/:queue/jobs/:jobId', queueController.removeJob.bind(queueController));

export default router;
