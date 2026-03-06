import { Router } from 'express';
import { jobController } from '@/controllers/job.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate, authenticateOptional } from '@/middlewares/auth.middleware';
import {
  getAllJobsSchema,
  getJobByIdSchema,
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from '@/validations/job.validation';


const router = Router();

router.get('/top', jobController.getTopJobs.bind(jobController));
router.get('/popular', jobController.getPopularJobs.bind(jobController));
router.get('/', validate(getAllJobsSchema), jobController.getAllJobs.bind(jobController));
router.get('/company', authenticate, validate(getAllJobsSchema), jobController.getCompanyJobs.bind(jobController));
router.get('/company/applicants', authenticate, validate(getAllJobsSchema), jobController.getCompanyApplicants.bind(jobController));
router.get('/company/:id', authenticate, validate(getJobByIdSchema), jobController.getCompanyJobById.bind(jobController));
router.get('/:id', authenticateOptional, validate(getJobByIdSchema), jobController.getJobById.bind(jobController));
router.post('/create', authenticate, validate(createJobSchema), jobController.createJob.bind(jobController));
router.put('/:id', authenticate, validate(updateJobSchema), jobController.updateJob.bind(jobController));
router.patch('/:id/status', authenticate, validate(updateJobStatusSchema), jobController.updateJobStatus.bind(jobController));

export default router;
