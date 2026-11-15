import { httpServerHandler } from 'cloudflare:node';
import app from './app';
import logger from '@/configs/logger.config';
import { handleEmailBatch, handleEmailDeadLetters } from '@/queues/email.consumer';
import { handleAssessmentBatch, handleAssessmentDeadLetters } from '@/queues/assessment.consumer';
import { runNightlyReset } from '@/demo/reset';
import { Config } from '@/constants/config.constant';

const PORT = 8080;
const EMAIL_DLQ = 'bayaw-jobs-email-dlq';

// httpServerHandler routes incoming fetch events to whatever listens on PORT.
app.listen(PORT);

const http = httpServerHandler({ port: PORT });
if (!http.fetch) throw new Error("httpServerHandler returned no fetch handler");
const fetchHandler = http.fetch;

export default {
  fetch: fetchHandler,

  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil(
      runNightlyReset().catch((error: unknown) => {
        logger.error('Demo reset failed', { error });
        throw error;
      })
    );
  },

  async queue(batch) {
    if (batch.queue === Config.BAYAWSEC.QUEUE_NAME) {
      await handleAssessmentBatch(batch);
      return;
    }
    if (batch.queue === Config.BAYAWSEC.DLQ_NAME) {
      await handleAssessmentDeadLetters(batch);
      return;
    }
    if (batch.queue === EMAIL_DLQ) {
      await handleEmailDeadLetters(batch);
      return;
    }
    await handleEmailBatch(batch);
  },
} satisfies ExportedHandler<Env>;
