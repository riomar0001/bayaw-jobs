import winston from 'winston';

const { combine, timestamp, colorize, printf, errors } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Pretty Console Format (NO JSON)
 */
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (stack) log += `\n${stack}`;
    return log;
  })
);

/**
 * Colored version only for dev console
 */
const coloredConsoleFormat = combine(colorize({ all: true }), consoleFormat);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
  transports: [
    // Console (colored in dev, plain in prod)
    new winston.transports.Console({
      format: isProduction ? consoleFormat : coloredConsoleFormat,
    }),

    // Error file (NO COLOR, NO JSON duplication in console)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), winston.format.json()),
    }),

    // Combined file
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), errors({ stack: true }), winston.format.json()),
    }),
  ],
});

export default logger;
