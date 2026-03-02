import { Router } from 'express';
import { jobController } from '@/controllers/job.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import {
  getAllJobsSchema,
  getJobByIdSchema,
  createJobSchema,
  updateJobSchema,
} from '@/validations/job.validation';

const router = Router();

router.get('/', validate(getAllJobsSchema), jobController.getAllJobs.bind(jobController));
router.get('/:id', validate(getJobByIdSchema), jobController.getJobById.bind(jobController));
router.post('/create', authenticate, validate(createJobSchema), jobController.createJob.bind(jobController));
router.put('/:id', authenticate, validate(updateJobSchema), jobController.updateJob.bind(jobController));

export default router;
