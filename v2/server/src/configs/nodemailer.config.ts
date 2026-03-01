import nodemailer from 'nodemailer';
import '@/configs/dotenv.config';
import logger from '@/configs/logger.config';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    logger.warn('Email transporter verification failed', { message: error.message });
  } else {
    logger.info('Email transporter is ready');
  }
});

export default transporter;
