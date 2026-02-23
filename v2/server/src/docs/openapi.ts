import { authDocs } from './auth.docs';
import { templateDocs } from './template.docs';
import { certificateDocs } from './certificate.docs';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Certificate Management API',
    version: '1.0.0',
    description: `
## Overview
API for managing digital certificates. Supports user authentication, certificate template management, and certificate generation/verification.

## Authentication
This API uses JWT Bearer tokens for authentication. Some endpoints also use HTTP-only cookies for refresh tokens.

### Authentication Flow
1. **Register** - Create a new account
2. **Verify Email** - Verify your email address
3. **Login** - Receive a temporary token and verification code via email
4. **Verify Auth** - Exchange the code for access and refresh tokens
5. **Refresh** - Use refresh token to get new access token

### Roles
- **user** - Basic authenticated user
- **admin** - Administrator with full access to templates and certificates
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
    {
      name: 'Templates',
      description: 'Certificate template management (admin only for create/update/delete)',
    },
    {
      name: 'Certificates',
      description: 'Certificate generation, verification, and management',
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
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'usr_abc123xyz' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          first_name: { type: 'string', example: 'John' },
          last_name: { type: 'string', example: 'Doe' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          is_verified: { type: 'boolean', example: true },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T10:30:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T10:30:00.000Z',
          },
        },
      },
      Template: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'tmpl_abc123xyz' },
          name: { type: 'string', example: 'Certificate of Completion' },
          image_url: {
            type: 'string',
            format: 'uri',
            example: 'https://storage.example.com/templates/template1.png',
          },
          width: { type: 'integer', example: 3508, description: 'A4 landscape at 300 DPI' },
          height: { type: 'integer', example: 2480, description: 'A4 landscape at 300 DPI' },
          default_full_name_x: { type: 'integer', example: 1754 },
          default_full_name_y: { type: 'integer', example: 1200 },
          default_full_name_size: { type: 'integer', example: 72 },
          default_date_x: { type: 'integer', example: 1754 },
          default_date_y: { type: 'integer', example: 1600 },
          default_date_size: { type: 'integer', example: 36 },
          default_control_x: { type: 'integer', example: 3200 },
          default_control_y: { type: 'integer', example: 2300 },
          default_control_size: { type: 'integer', example: 24 },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T10:30:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T10:30:00.000Z',
          },
        },
      },
      Certificate: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cert_abc123xyz' },
          control_number: { type: 'string', example: 'CERT-2026-001234' },
          full_name: { type: 'string', example: 'John Doe' },
          recipient_email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
          date_text: { type: 'string', example: 'February 2, 2026' },
          certificate_url: {
            type: 'string',
            format: 'uri',
            example: 'https://storage.example.com/certificates/cert1.png',
          },
          template_id: { type: 'string', example: 'tmpl_abc123xyz' },
          created_by_id: { type: 'string', example: 'usr_abc123xyz' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T10:30:00.000Z',
          },
        },
      },
      TextPosition: {
        type: 'object',
        description: 'Text element with position and styling',
        properties: {
          text: { type: 'string', example: 'John Doe' },
          x: {
            type: 'integer',
            minimum: 0,
            example: 1754,
            description: 'X position in pixels',
          },
          y: {
            type: 'integer',
            minimum: 0,
            example: 1200,
            description: 'Y position in pixels',
          },
          fontSize: {
            type: 'integer',
            minimum: 8,
            maximum: 200,
            example: 72,
            description: 'Font size in pixels',
          },
          color: {
            type: 'string',
            pattern: '^#[0-9A-Fa-f]{6}$',
            example: '#000000',
            description: 'Hex color code',
          },
          fontWeight: {
            type: 'string',
            enum: ['normal', 'bold', 'lighter', 'bolder'],
            example: 'bold',
          },
        },
        required: ['text', 'x', 'y'],
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 10 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  paths: {
    ...authDocs,
    ...templateDocs,
    ...certificateDocs,
  },
};

export default openApiSpec;
