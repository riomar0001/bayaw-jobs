import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiReference } from '@scalar/express-api-reference';
import { helmetConfig } from '@/configs/helmet.config';
import routes from '@/routes';
import { errorMiddleware, notFoundMiddleware } from '@/middlewares/error.middleware';
import { requestLogger } from '@/middlewares/requestLogger.middleware';
import { generalRateLimiter } from '@/middlewares/rateLimit.middleware';
import openApiSpec from '@/docs/openapi';

const app = express();

// Workers have no client socket. Cloudflare sets CF-Connecting-IP itself
// (overwriting any client value), so it's the trustworthy source for req.ip.
app.use((req, _res, next) => {
  const ip = req.headers['cf-connecting-ip'];
  if (typeof ip === 'string' && ip.length > 0) {
    Object.defineProperty(req, 'ip', { value: ip, configurable: true });
  }
  next();
});

// Security middleware
app.use(helmet(helmetConfig));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use(generalRateLimiter);

// HTTP request logging
app.use(requestLogger);

// Raw OpenAPI JSON endpoint (must be before Scalar middleware)
app.get('/api/docs/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// API Documentation with Scalar
app.use(
  '/api/docs',
  apiReference({
    content: openApiSpec,
    theme: 'kepler',
  })
);

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
