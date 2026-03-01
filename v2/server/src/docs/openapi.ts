import { authDocs } from './auth.docs';
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Certificate Management API',
    version: '1.0.0',
    description: `
    ## Overview
    API for managing digital certificates. Supports user authentication, certificate template management, and certificate generation/verification.

    `,
    contact: {
      name: 'API Support',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User registration, login, and token management',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      tempAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Temporary token received from login endpoint',
      },
    },
  },
  paths: {
    ...authDocs,
  },
};

export default openApiSpec;
