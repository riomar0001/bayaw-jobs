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
    status: {
      type: 'string',
      enum: ['OPEN', 'CLOSED', 'PAUSED'],
      example: 'OPEN',
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
  status: {
    type: 'string',
    enum: ['OPEN', 'CLOSED', 'PAUSED'],
    example: 'OPEN',
    description: 'Job posting status. Defaults to OPEN if not provided.',
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

// ─── GET /jobs/company ────────────────────────────────────────────────────────

const getCompanyJobs = {
  '/jobs/company': {
    get: {
      tags: ['Jobs'],
      summary: "Get the authenticated company's job postings",
      description:
        'Returns all job postings belonging to the authenticated user\'s company, resolved from the JWT token. ' +
        'Supports pagination via page and limit query parameters.',
      security: [{ bearerAuth: [] }],
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
          description: 'Company jobs retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Company jobs retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string', example: 'Senior Software Engineer' },
                            department: { type: 'string', example: 'Engineering' },
                            location: { type: 'string', example: 'Cebu City, Philippines' },
                            employment_type: { type: 'string', example: 'Full-time' },
                            location_type: {
                              type: 'string',
                              enum: ['ONSITE', 'REMOTE', 'HYBRID'],
                              example: 'HYBRID',
                            },
                            status: {
                              type: 'string',
                              enum: ['OPEN', 'CLOSED', 'PAUSED'],
                              example: 'OPEN',
                            },
                            applicant_count: { type: 'integer', example: 12 },
                            created_at: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer', example: 5 },
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                          totalPages: { type: 'integer', example: 1 },
                          hasNextPage: { type: 'boolean', example: false },
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
        401: {
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
        },
        422: {
          description: 'User has no company — company_id missing from JWT token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Company ID is required' },
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

// ─── GET /jobs/company/{id} ───────────────────────────────────────────────────

const getCompanyJobById = {
  '/jobs/company/{id}': {
    get: {
      tags: ['Jobs'],
      summary: 'Get a company job posting with its applicants',
      description:
        "Returns a specific job posting belonging to the authenticated user's company, " +
        'along with all applicants who have applied for that job. ' +
        'The job must belong to the company in the JWT token.',
      security: [{ bearerAuth: [] }],
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
                  data: {
                    type: 'object',
                    properties: {
                      ...jobResponseData.properties,
                      applicant_applied_job: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            applicant_profile_id: { type: 'string', format: 'uuid' },
                            job_id: { type: 'string', format: 'uuid' },
                            application_date: { type: 'string', format: 'date-time' },
                            status: {
                              type: 'string',
                              enum: ['PENDING', 'ACCEPTED', 'UNDER_REVIEW', 'REJECTED', 'WITHDRAWN'],
                              example: 'PENDING',
                            },
                            applicant_profile: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                first_name: { type: 'string', example: 'Jane' },
                                last_name: { type: 'string', example: 'Doe' },
                                email: { type: 'string', format: 'email' },
                                age: { type: 'integer', example: 25 },
                                gender: { type: 'string', example: 'Female' },
                                desired_position: { type: 'string', example: 'Software Engineer' },
                                location: { type: 'string', example: 'Cebu City, Philippines' },
                                profile_picture: { type: 'string', nullable: true },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: unauthorizedResponse,
        404: { description: 'Job not found or does not belong to the authenticated company' },
        422: {
          description: 'User has no company — company_id missing from JWT token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Company ID is required' },
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

// ─── PATCH /jobs/{id}/status ──────────────────────────────────────────────────

const updateJobStatus = {
  '/jobs/{id}/status': {
    patch: {
      tags: ['Jobs'],
      summary: 'Update job posting status',
      description:
        'Updates the status of a job posting. Only authorized company users (owner or can_update) can change the status. ' +
        'The job must belong to the authenticated user\'s company.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the job',
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
              required: ['status'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['OPEN', 'CLOSED', 'PAUSED'],
                  example: 'CLOSED',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Job status updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Job status updated successfully' },
                  data: jobResponseData,
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid status value',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'status must be one of: OPEN, CLOSED, PAUSED' },
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
                  message: { type: 'string', example: 'Company ID is required' },
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
  ...getCompanyJobs,
  ...getCompanyJobById,
  ...jobById,
  ...createJob,
  ...updateJobStatus,
};
