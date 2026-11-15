import { authDocs } from './auth.docs';
import { applicantDocs } from './applicant.docs';
import { companyDocs } from './company.docs';
import { jobDocs } from './job.docs';
import { assessmentDocs } from './assessment.docs';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Bayaw Jobs API',
    version: '1.0.0',
    description: `
    ## Overview
    API for the Bayaw Jobs platform. Supports user authentication, applicant onboarding, profile management, and resume uploads.

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
      name: 'Applicants',
      description: 'Applicant onboarding and profile management',
    },
    {
      name: 'Business',
      description: 'Business onboarding and company management',
    },
    {
      name: 'Jobs',
      description: 'Job posting management',
    },
    {
      name: 'BayawSec',
      description:
        'AI-assisted security assessment (admin only, non-shared accounts). Targets, scope, scans, imports, AI analysis, verification, dashboard and report data.',
    },
    {
      name: 'BayawSec Agent',
      description: 'Optional scanner agent endpoints (bearer SCANNER_AGENT_TOKEN, off by default).',
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
    ...applicantDocs,
    ...companyDocs,
    ...jobDocs,
    ...assessmentDocs,
  },
};

export default openApiSpec;
