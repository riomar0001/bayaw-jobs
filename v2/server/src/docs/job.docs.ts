// ─── Shared response helpers ──────────────────────────────────────────────────

const unauthorizedResponse = {
  description: 'Unauthorized - user must be authenticated',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'No token provided' },
        },
      },
    },
  },
};

const internalErrorResponse = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Internal server error' },
        },
      },
    },
  },
};

const forbiddenResponse = {
  description: 'Forbidden - only authorized company users can perform this action',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Only authorized company users can create job postings',
          },
        },
      },
    },
  },
};

const jobResponseData = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
    company_id: { type: 'string', format: 'uuid' },
    title: { type: 'string', example: 'Senior Software Engineer' },
    department: { type: 'string', example: 'Engineering' },
    location: { type: 'string', example: 'Cebu City, Philippines' },
    location_type: { type: 'string', enum: ['ONSITE', 'REMOTE', 'HYBRID'], example: 'HYBRID' },
    employment_type: { type: 'string', example: 'Full-time' },
    minimum_salary: { type: 'string', example: '50000' },
    maximum_salary: { type: 'string', example: '80000' },
    currency: { type: 'string', example: 'PHP' },
    description: { type: 'string', example: 'We are looking for a skilled engineer...' },
    responsibilities: {
      type: 'array',
      items: { type: 'string' },
      example: ['Design and build scalable systems', 'Lead technical discussions'],
    },
    qualifications: {
      type: 'array',
      items: { type: 'string' },
      example: ['3+ years of experience in Node.js', "Bachelor's degree in CS"],
    },
    benefits: {
      type: 'array',
      items: { type: 'string' },
      example: ['HMO', '13th month', 'Remote work'],
    },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

const jobRequestBody = {
  title: { type: 'string', example: 'Senior Software Engineer' },
  department: { type: 'string', example: 'Engineering' },
  location: { type: 'string', example: 'Cebu City, Philippines' },
  location_type: { type: 'string', enum: ['ONSITE', 'REMOTE', 'HYBRID'], example: 'HYBRID' },
  employment_type: { type: 'string', example: 'Full-time' },
  minimum_salary: { type: 'string', example: '50000' },
  maximum_salary: { type: 'string', example: '80000' },
  currency: { type: 'string', example: 'PHP' },
  description: { type: 'string', example: 'We are looking for a skilled engineer...' },
  responsibilities: {
    type: 'array',
    items: { type: 'string' },
    example: ['Design and build scalable systems', 'Lead technical discussions'],
  },
  qualifications: {
    type: 'array',
    items: { type: 'string' },
    example: ['3+ years of experience in Node.js', "Bachelor's degree in CS"],
  },
  benefits: {
    type: 'array',
    items: { type: 'string' },
    example: ['HMO', '13th month', 'Remote work'],
  },
};

// ─── GET /jobs ────────────────────────────────────────────────────────────────

const getAllJobs = {
  '/jobs': {
    get: {
      tags: ['Jobs'],
      summary: 'Get all job postings with pagination',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number (default: 1)',
          required: false,
          schema: { type: 'integer', default: 1, minimum: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Items per page (default: 10, max: 100)',
          required: false,
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
        },
      ],
      responses: {
        200: {
          description: 'Jobs retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Jobs retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: jobResponseData,
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer', example: 100 },
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                          totalPages: { type: 'integer', example: 10 },
                          hasNextPage: { type: 'boolean', example: true },
                          hasPreviousPage: { type: 'boolean', example: false },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Invalid query parameters' },
        500: internalErrorResponse,
      },
    },
  },
};

// ─── GET /jobs/{id} + PUT /jobs/{id} ─────────────────────────────────────────

const jobById = {
  '/jobs/{id}': {
    get: {
      tags: ['Jobs'],
      summary: 'Get a job posting by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the job to retrieve',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        200: {
          description: 'Job retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Job retrieved successfully' },
                  data: jobResponseData,
                },
              },
            },
          },
        },
        404: { description: 'Job not found' },
        500: internalErrorResponse,
      },
    },
    put: {
      tags: ['Jobs'],
      summary: 'Update an existing job posting',
      description:
        'Updates a job posting. Both the user and company are resolved from the JWT token. ' +
        'The update is scoped to the authenticated user\'s company — the job must belong to their company or the request will fail. ' +
        'All body fields are optional; at least one must be provided.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the job to update',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: jobRequestBody,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Job updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Job updated successfully' },
                  data: jobResponseData,
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - validation errors or missing fields',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: { description: 'Job not found or does not belong to the authenticated company' },
        422: {
          description: 'User has no company — company_id missing from JWT token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Company ID is required to update a job' },
                },
              },
            },
          },
        },
        500: internalErrorResponse,
      },
    },
  },
};

// ─── POST /jobs/create ────────────────────────────────────────────────────────

const createJob = {
  '/jobs/create': {
    post: {
      tags: ['Jobs'],
      summary: 'Create a new job posting',
      description:
        'Creates a job posting under the authenticated user\'s company. ' +
        'The company is resolved automatically from the JWT token — no company_id is required in the request body. ' +
        'The token must include a company_id (i.e. the user must have completed company onboarding).',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'title',
                'department',
                'location',
                'location_type',
                'employment_type',
                'minimum_salary',
                'maximum_salary',
                'currency',
                'description',
                'responsibilities',
                'qualifications',
                'benefits',
              ],
              properties: jobRequestBody,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Job created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Job created successfully' },
                  data: jobResponseData,
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - validation errors or missing fields',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        401: unauthorizedResponse,
        403: forbiddenResponse,
        422: {
          description: 'User has no company — company_id missing from JWT token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Company ID is required to create a job' },
                },
              },
            },
          },
        },
        500: internalErrorResponse,
      },
    },
  },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const jobDocs = {
  ...getAllJobs,
  ...jobById,
  ...createJob,
};
