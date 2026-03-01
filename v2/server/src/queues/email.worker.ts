import { Worker, Job, ConnectionOptions } from 'bullmq';
import { createRedisConnection } from '@/configs/bullmq.config';
import { transporter } from '@/configs/nodemailer.config';
import { Config } from '@/constants/config.constant';
import { EmailJobData } from './email.queue';
import logger from '@/configs/logger.config';

const processEmailJob = async (
  job: Job<EmailJobData>
): Promise<{ success: boolean; sentAt: string }> => {
  const { to, subject, html, attachments } = job.data;

  logger.info(`Processing email job ${job.id}`, { type: job.data.type, to });

  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    };

    await transporter.sendMail(mailOptions);

    const sentAt = new Date().toISOString();
    logger.info(`Email job ${job.id} sent successfully`, { sentAt });

    return { success: true, sentAt };
  } catch (error) {
    logger.error(`Email job ${job.id} failed`, { error });
    throw error;
  }
};

export const createEmailWorker = () => {
  const worker = new Worker<EmailJobData>(Config.EMAIL_QUEUE.NAME, processEmailJob, {
    connection: createRedisConnection() as unknown as ConnectionOptions,
    concurrency: Config.EMAIL_QUEUE.CONCURRENCY,
    limiter: {
      max: 10,
      duration: 1000, // 10 emails per second max
    },
  });

  worker.on('completed', (job, result) => {
    logger.info(`Worker: Email job ${job.id} completed`, { result });
  });

  worker.on('failed', (job, error) => {
    logger.error(`Worker: Email job ${job?.id} failed`, { message: error.message });
  });

  worker.on('error', (error) => {
    logger.error('Worker error', { error });
  });

  worker.on('stalled', (jobId) => {
    logger.warn(`Worker: Job ${jobId} stalled`);
  });

  return worker;
};

export default createEmailWorker;
