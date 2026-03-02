import { Router } from 'express';
import { jobController } from '@/controllers/job.controller';

const router = Router();

router.get('/', jobController.getAllJobs.bind(jobController));
router.get('/:id', jobController.getJobById.bind(jobController));
router.post('/create', jobController.createJob.bind(jobController));
router.put('/:id', jobController.updateJob.bind(jobController));

export default router;
