import prisma from '@/configs/prisma.config';
import logger from '@/configs/logger.config';
import { storageService } from '@/services/storage.service';
import { resetDemoData } from './seed';

/** Nightly demo reset: wipe uploads and every table, then reload the dummy data. */
export async function runNightlyReset(): Promise<void> {
  const startedAt = Date.now();
  logger.info('Demo reset started');

  const removedFiles = await storageService.deleteAll();
  await resetDemoData(prisma);

  logger.info('Demo reset finished', { removedFiles, durationMs: Date.now() - startedAt });
}
