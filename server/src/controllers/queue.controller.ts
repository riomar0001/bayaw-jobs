import { Request, Response, NextFunction } from 'express';
import { queueService, JobState } from '@/services/queue.service';
import { successResponse, noContentResponse } from '@/utils/apiResponse.util';
import { BadRequestError } from '@/utils/errors.util';

const VALID_STATES: JobState[] = ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused'];

export class QueueController {
  async getAllQueues(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await queueService.getAllQueues();
      successResponse(res, data, 'Queues retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      const state = (req.query.state as JobState) ?? 'waiting';
      const start = parseInt(req.query.start as string) || 0;
      const end = parseInt(req.query.end as string) || 49;

      if (!VALID_STATES.includes(state)) {
        throw new BadRequestError(`Invalid state. Must be one of: ${VALID_STATES.join(', ')}`);
      }


      const data = await queueService.getJobs(queue, state, start, end);
      successResponse(res, data, 'Jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDlqJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      const start = parseInt(req.query.start as string) || 0;
      const end = parseInt(req.query.end as string) || 49;
      const data = await queueService.getDlqJobs(queue, start, end);
      successResponse(res, data, 'DLQ jobs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async retryJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue, jobId } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      if (!jobId || typeof jobId !== 'string') {
        throw new BadRequestError('Job ID is required');
      }

      await queueService.retryJob(queue, jobId);
      successResponse(res, null, 'Job queued for retry');
    } catch (error) {
      next(error);
    }
  }

  async removeJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue, jobId } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      if (!jobId || typeof jobId !== 'string') {
        throw new BadRequestError('Job ID is required');
      }
      await queueService.removeJob(queue, jobId);
      noContentResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async retryAllDlq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      const result = await queueService.retryAllDlq(queue);
      successResponse(res, result, `Retried ${result.retried} DLQ jobs`);
    } catch (error) {
      next(error);
    }
  }

  async clearDlq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      const result = await queueService.clearDlq(queue);
      successResponse(res, result, `Cleared ${result.removed} DLQ jobs`);
    } catch (error) {
      next(error);
    }
  }

  async pauseQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      await queueService.pauseQueue(queue);
      successResponse(res, null, `Queue '${queue}' paused`);
    } catch (error) {
      next(error);
    }
  }

  async resumeQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      await queueService.resumeQueue(queue);
      successResponse(res, null, `Queue '${queue}' resumed`);
    } catch (error) {
      next(error);
    }
  }

  async drainQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { queue } = req.params;
      if (!queue || typeof queue !== 'string') {
        throw new BadRequestError('Queue name is required');
      }
      await queueService.drainQueue(queue);
      successResponse(res, null, `Queue '${queue}' drained`);
    } catch (error) {
      next(error);
    }
  }
}

export const queueController = new QueueController();
