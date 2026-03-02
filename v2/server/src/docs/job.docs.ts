const getJobById = {
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
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Job retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Job',
              },
            },
          },
        },
        404: { description: 'Job not found' },
        500: { description: 'Internal server error' },
      },
    },
  },
};

const getAllJobs = {
  '/jobs/': {
    get: {
      tags: ['Jobs'],
      summary: 'Get all job postings with pagination',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination (default: 1)',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page for pagination (default: 10, max: 100)',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
            maximum: 100,
          },
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
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        department: { type: 'string' },
                        location: { type: 'string' },
                        location_type: { type: 'string' },
                        employment_type: { type: 'string' },
                        minimum_salary: { type: 'string' },
                        maximum_salary: { type: 'string' },
                        currency: { type: 'string' },
                        description: { type: 'string' },
                        responsibilities: { type: 'string' },
                        qualifications: { type: 'string' },
                        benefits: { type: 'string' },
                        company_id: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      totalPages: { type: 'integer' },
                      hasNextPage: { type: 'boolean' },
                      hasPreviousPage: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Invalid query parameters' },
        500: { description: 'Internal server error' },
      },
    },
  },
};

const createJob = {
  '/jobs/create': {
    post: {
      tags: ['Jobs'],
      summary: 'Create a new job posting',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                department: { type: 'string' },
                location: { type: 'string' },
                location_type: { type: 'string' },
                employment_type: { type: 'string' },
                minimum_salary: { type: 'string' },
                maximum_salary: { type: 'string' },
                currency: { type: 'string' },
                description: { type: 'string' },
                responsibilities: { type: 'string' },
                qualifications: { type: 'string' },
                benefits: { type: 'string' },
                company_id: { type: 'string' },
              },
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
                $ref: '#/components/schemas/Job',
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
                  error: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized - user must be authenticated' },
        403: { description: 'Forbidden - only company users can create job postings' },
      },
    },
  },
};

const updateJob = {
  '/jobs/{id}': {
    put: {
      tags: ['Jobs'],
      summary: 'Update an existing job posting',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the job to update',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user_id: { type: 'string' },
                title: { type: 'string' },
                department: { type: 'string' },
                location: { type: 'string' },
                location_type: { type: 'string' },
                employment_type: { type: 'string' },
                minimum_salary: { type: 'string' },
                maximum_salary: { type: 'string' },
                currency: { type: 'string' },
                description: { type: 'string' },
                responsibilities: { type: 'string' },
                qualifications: { type: 'string' },
                benefits: { type: 'string' },
                company_id: { type: 'string' },
              },
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
                $ref: '#/components/schemas/Job',
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
                  error: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized - user must be authenticated' },
        403: { description: 'Forbidden - only company users can update job postings' },
        404: { description: 'Job not found' },
      },
    },
  },
};

export const jobDocs = {
  ...getAllJobs,
  '/jobs/{id}': {
    ...getJobById['/jobs/{id}'],
    ...updateJob['/jobs/{id}'],
  },
  ...createJob,
};
