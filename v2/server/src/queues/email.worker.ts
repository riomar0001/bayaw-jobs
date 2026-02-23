import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '@/configs/bullmq.config';
import { transporter } from '@/configs/nodemailer.config';
import { Config } from '@/constants/config.constant';
import { EmailJobData } from './email.queue';

const processEmailJob = async (
  job: Job<EmailJobData>
): Promise<{ success: boolean; sentAt: string }> => {
  const { to, subject, html, attachments } = job.data;

  console.log(`Processing email job ${job.id}: ${job.data.type} to ${to}`);

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
    console.log(`Email job ${job.id} sent successfully at ${sentAt}`);

    return { success: true, sentAt };
  } catch (error) {
    console.error(`Email job ${job.id} failed:`, error);
    throw error;
  }
};

export const createEmailWorker = () => {
  const worker = new Worker<EmailJobData>(Config.EMAIL_QUEUE.NAME, processEmailJob, {
    connection: createRedisConnection(),
    concurrency: Config.EMAIL_QUEUE.CONCURRENCY,
    limiter: {
      max: 10,
      duration: 1000, // 10 emails per second max
    },
  });

  worker.on('completed', (job, result) => {
    console.log(`Worker: Email job ${job.id} completed with result:`, result);
  });

  worker.on('failed', (job, error) => {
    console.error(`Worker: Email job ${job?.id} failed with error:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  worker.on('stalled', (jobId) => {
    console.warn(`Worker: Job ${jobId} stalled`);
  });

  return worker;
};

export default createEmailWorker;
