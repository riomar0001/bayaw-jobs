import { Router } from 'express';
import multer from 'multer';
import { Config } from '@/constants/config.constant';
import { assessmentController as c } from '@/controllers/assessment.controller';
import { requireScannerAgent } from '@/middlewares/bayawsec.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { agentResultSchema } from '@/validations/assessment.validation';

// Optional scanner agent API, mounted at /api/assessments/agent.
// Returns 404 unless SCANNER_AGENT_ENABLED=true and SCANNER_AGENT_TOKEN is set.
const router = Router();

const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Config.BAYAWSEC.MAX_IMPORT_SIZE, files: 1 },
});

router.use(requireScannerAgent);

router.get('/config', c.agentConfig);
router.post('/jobs/claim', c.agentClaim);
router.post('/jobs/:id/result', reportUpload.single('file'), validate(agentResultSchema), c.agentResult);

export default router;
