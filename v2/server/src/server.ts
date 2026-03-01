import '@/configs/dotenv.config';
import app from './app';
import logger from '@/configs/logger.config';
import { createEmailWorker } from '@/queues/email.worker';
import '@/jobs/tokenCleanup.job';

const PORT = process.env.PORT || 4000;

// Start email worker
const emailWorker = createEmailWorker();

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');

  // Close email worker
  await emailWorker.close();

  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  logger.info(`API URL: http://localhost:${PORT}/api`);
  logger.info(`API DOCS URL: http://localhost:${PORT}/api/docs`);
  logger.info('Email worker started');
  logger.info('Token cleanup job scheduled (every 12 hours)');
});
