import winston from 'winston';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf((info) => {
    const { level, message, timestamp: ts, stack, ...meta } = info as {
      level: string;
      message: string;
      timestamp: string;
      stack?: string;
      [key: string]: unknown;
    };

    let log = `${ts} [${level}]: ${message}`;
    if (stack) log += `\n${stack}`;

    const metaKeys = Object.keys(meta);
    if (metaKeys.length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;

    return log;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
  format: isProduction ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

if (isProduction) {
  logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}

export default logger;
