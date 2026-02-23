import '@/configs/dotenv.config';
import app from './app';
import { createEmailWorker } from '@/queues/email.worker';
import '@/jobs/tokenCleanup.job';

const PORT = process.env.PORT || 4000;

// Start email worker
const emailWorker = createEmailWorker();

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');

  // Close email worker
  await emailWorker.close();

  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`API DOCS URL: http://localhost:${PORT}/api/docs`);
  console.log('Email worker started');
  console.log('Token cleanup job scheduled (every 12 hours)');
});
