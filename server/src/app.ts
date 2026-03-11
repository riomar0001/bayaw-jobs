import '@/configs/dotenv.config';
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
import { metricsMiddleware, metricsAuth } from '@/middlewares/metrics.middleware';
import registry from '@/configs/metrics.config';
import openApiSpec from '@/docs/openapi';

const app = express();

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

// Prometheus metrics endpoint — registered before rate limiter so scrapes are never throttled
app.get('/metrics', metricsAuth, async (_req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

// Rate limiting
app.use(generalRateLimiter);

// HTTP request logging
app.use(requestLogger);

// Prometheus HTTP metrics collection
app.use(metricsMiddleware);

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
