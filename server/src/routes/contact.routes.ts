import { Router } from 'express';
import { z } from 'zod';
import { validate } from '@/middlewares/validation.middleware';
import { strictRateLimiter } from '@/middlewares/rateLimit.middleware';
import { limitByIp } from '@/middlewares/activityLimit.middleware';
import { emailService } from '@/services/email.service';
import { successResponse } from '@/utils/apiResponse.util';

const contactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().trim().email('Invalid email address').max(254),
    subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(150),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  }),
});

const router = Router();

// Public form: capped per minute (rate limiter) and per day (activity limit) for each IP.
router.post('/', strictRateLimiter, limitByIp('CONTACT'), validate(contactSchema), async (req, res, next) => {
  try {
    await emailService.sendContactMessage(req.body as z.infer<typeof contactSchema>['body']);
    successResponse(res, null, 'Message sent');
  } catch (error) {
    next(error);
  }
});

export default router;
