import { Router } from 'express';
import multer from 'multer';
import { Config } from '@/constants/config.constant';
import { assessmentController as c } from '@/controllers/assessment.controller';
import { limitActivity } from '@/middlewares/activityLimit.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireBayawSec } from '@/middlewares/bayawsec.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import { validate } from '@/middlewares/validation.middleware';
import * as V from '@/validations/assessment.validation';

// BayawSec admin API, mounted at /api/admin/assessments.
const router = Router();

const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Config.BAYAWSEC.MAX_IMPORT_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = /\.(xml|json)$/i.test(file.originalname);
    cb(null, ok);
  },
});

const screenshotUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Config.UPLOAD.MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)),
});

router.use(authenticate, requireAdmin, requireBayawSec);

// ── Targets & scope ──────────────────────────────────────────────────────────
router.post('/targets', validate(V.createTargetSchema), c.createTarget);
router.get('/targets', c.listTargets);
router.get('/targets/:id', validate(V.targetIdSchema), c.getTarget);
router.patch('/targets/:id', validate(V.updateTargetSchema), c.updateTarget);
router.post('/targets/:id/scope', validate(V.addScopeRuleSchema), c.addScopeRule);
router.delete('/targets/:id/scope/:ruleId', validate(V.scopeRuleIdSchema), c.deleteScopeRule);

// ── Scans & imports ──────────────────────────────────────────────────────────
router.post('/targets/:id/scans', validate(V.startScanSchema), c.startScan);
router.get('/targets/:id/scans', validate(V.targetIdSchema), c.listScans);
router.post(
  '/targets/:id/imports/:tool',
  reportUpload.single('file'),
  validate(V.importReportSchema),
  c.importReport
);
router.get('/scans/:id', validate(V.scanIdSchema), c.getScan);
router.get('/scans/:id/raw', validate(V.scanIdSchema), c.downloadScanRaw);

// ── AI (daily cap per assessor) ──────────────────────────────────────────────
router.post('/scans/:id/interpret', validate(V.scanIdSchema), limitActivity('AI_ANALYZE'), c.interpretScan);
router.get('/scans/:id/ai', validate(V.scanIdSchema), c.scanAnalyses);
router.post('/findings/:id/remediation', validate(V.findingIdSchema), limitActivity('AI_ANALYZE'), c.requestRemediation);
router.get('/findings/:id/ai', validate(V.findingIdSchema), c.findingAnalyses);
router.get('/jobs/:id', validate(V.jobIdSchema), c.getJob);

// ── Findings & verification ──────────────────────────────────────────────────
router.get('/findings', validate(V.listFindingsSchema), c.listFindings);
router.post('/findings', validate(V.createFindingSchema), c.createFinding);
router.get('/findings/:id', validate(V.findingIdSchema), c.getFinding);
router.patch('/findings/:id/verify', validate(V.verifyFindingSchema), c.verifyFinding);
router.patch('/findings/:id/remediation', validate(V.setRemediationSchema), c.setRemediation);
router.post('/findings/:id/evidence', screenshotUpload.single('file'), validate(V.addEvidenceSchema), c.addEvidence);
router.get('/evidence/:id/file', validate(V.evidenceIdSchema), c.downloadEvidence);

// ── Dashboard & report ───────────────────────────────────────────────────────
router.get('/dashboard', validate(V.dashboardSchema), c.dashboard);
router.get('/targets/:id/report', validate(V.targetIdSchema), c.report);

export default router;
