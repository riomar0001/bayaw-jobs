const getTopCompanies = {
  '/business/top': {
    get: {
      tags: ['Business'],
      summary: 'Get top 6 companies by open job count',
      description:
        'Returns the 6 companies with the most open job postings. No authentication required.',
      responses: {
        200: {
          description: 'Top companies retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Top companies retrieved successfully' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        company_name: { type: 'string', example: 'Acme Corp' },
                        industry: { type: 'string', example: 'Technology' },
                        company_size: { type: 'string', example: '11-50' },
                        logo: { type: 'string', nullable: true, example: 'logo_userId.jpg' },
                        website: { type: 'string', example: 'https://acme.com' },
                        open_jobs_count: { type: 'integer', example: 12 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        500: {
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
        },
      },
    },
  },
};

const onboarding = {
  '/business/onboarding': {
    post: {
      tags: ['Business'],
      summary: 'Business onboarding',
      description:
        'Create a company profile. Accepts multipart/form-data with an optional `logo` image and a `data` field containing the JSON payload.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['data'],
              properties: {
                logo: {
                  type: 'string',
                  format: 'binary',
                  description: 'Company logo image (JPEG, PNG, or WebP, max 5MB)',
                },
                data: {
                  type: 'string',
                  description: 'JSON string containing company onboarding data',
                  example: JSON.stringify({
                    company_name: 'Acme Corp',
                    industry: 'Technology',
                    about: 'We build awesome products.',
                    company_size: '11-50',
                    foundation_year: 2010,
                    website: 'https://acme.com',
                    owner_position: 'CEO',
                    contact: { email: 'hr@acme.com', phone: '+1234567890' },
                    social_links: [
                      { platform: 'LINKEDIN', url: 'https://linkedin.com/company/acme' },
                    ],
                    locations: [
                      {
                        address: '123 Main St',
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'USA',
                        postal_code: '94105',
                        is_headquarter: true,
                      },
                    ],
                  }),
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Business onboarding completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Business onboarding completed successfully',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      user_id: { type: 'string', format: 'uuid' },
                      company_name: { type: 'string', example: 'Acme Corp' },
                      industry: { type: 'string', example: 'Technology' },
                      about: { type: 'string', example: 'We build awesome products.' },
                      company_size: { type: 'string', example: '11-50' },
                      foundation_year: { type: 'integer', example: 2010 },
                      website: { type: 'string', example: 'https://acme.com' },
                      logo: { type: 'string', nullable: true, example: 'logo_userId.jpg' },
                      logo_url: {
                        type: 'string',
                        nullable: true,
                        example: 'https://api.example.com/api/business/logo/companyId',
                      },
                      companyContacts: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            email: { type: 'string', example: 'hr@acme.com' },
                            phone: { type: 'string', example: '+1234567890' },
                          },
                        },
                      },
                      companySocialLinks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            platform: {
                              type: 'string',
                              enum: ['FACEBOOK', 'TWITTER', 'LINKEDIN', 'INSTAGRAM'],
                            },
                            url: { type: 'string', example: 'https://linkedin.com/company/acme' },
                          },
                        },
                      },
                      companyLocations: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            address: { type: 'string' },
                            city: { type: 'string' },
                            state: { type: 'string' },
                            country: { type: 'string' },
                            postal_code: { type: 'string' },
                            is_headquarter: { type: 'boolean', example: true },
                          },
                        },
                      },
                      companyAdmins: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            user_id: { type: 'string', format: 'uuid' },
                            role: { type: 'string', example: 'OWNER' },
                            position: { type: 'string', example: 'CEO' },
                            can_create: { type: 'boolean', example: true },
                            can_read: { type: 'boolean', example: true },
                            can_update: { type: 'boolean', example: true },
                            can_delete: { type: 'boolean', example: true },
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
        '400': { description: 'Validation error' },
        '401': { description: 'Unauthorized' },
        '409': { description: 'Company profile already exists' },
      },
    },
  },
};

const logo = {
  '/business/logo': {
    patch: {
      tags: ['Business'],
      summary: 'Update company logo',
      description: "Upload a new logo for the authenticated user's company.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['logo'],
              properties: {
                logo: {
                  type: 'string',
                  format: 'binary',
                  description: 'New company logo (JPEG, PNG, or WebP, max 5MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Company logo updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Company logo updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      logo: { type: 'string', example: 'logo_userId.jpg' },
                      url: {
                        type: 'string',
                        example: 'https://api.example.com/api/business/logo/companyId',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'Logo image is required' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
      },
    },
  },
  '/business/logo/{id}': {
    get: {
      tags: ['Business'],
      summary: 'Get company logo',
      description: 'Retrieve the company logo image by company ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Company ID',
        },
      ],
      responses: {
        '200': {
          description: 'Company logo image',
          content: {
            'image/jpeg': { schema: { type: 'string', format: 'binary' } },
            'image/png': { schema: { type: 'string', format: 'binary' } },
            'image/webp': { schema: { type: 'string', format: 'binary' } },
          },
        },
        '400': { description: 'Company ID is required' },
        '404': { description: 'Company or logo not found' },
      },
    },
  },
};

const adminResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    company_id: { type: 'string', format: 'uuid' },
    user_id: { type: 'string', format: 'uuid' },
    role: { type: 'string', example: 'MODERATOR' },
    position: { type: 'string', nullable: true, example: 'HR Manager' },
    can_create: { type: 'boolean', example: false },
    can_read: { type: 'boolean', example: true },
    can_update: { type: 'boolean', example: false },
    can_delete: { type: 'boolean', example: false },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

const admins = {
  '/business/admins': {
    get: {
      tags: ['Business'],
      summary: 'Get all company admins',
      description:
        "Retrieve all admins of the authenticated user's company, along with the requesting user's own admin record (`my_rights`) showing their permissions.",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Company admins retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Company admins retrieved successfully',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      admins: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            company_id: { type: 'string', format: 'uuid' },
                            user_id: { type: 'string', format: 'uuid' },
                            role: { type: 'string', example: 'OWNER' },
                            position: {
                              type: 'string',
                              nullable: true,
                              example: 'CEO',
                            },
                            can_create: { type: 'boolean', example: true },
                            can_read: { type: 'boolean', example: true },
                            can_update: { type: 'boolean', example: true },
                            can_delete: { type: 'boolean', example: true },
                            created_at: {
                              type: 'string',
                              format: 'date-time',
                            },
                            updated_at: {
                              type: 'string',
                              format: 'date-time',
                            },
                            profile_picture: {
                              type: 'string',
                              nullable: true,
                              example: 'company_admin_abc123.jpg',
                              description:
                                'Stored filename in the profile picture bucket, null if not uploaded',
                            },
                            profile_picture_url: {
                              type: 'string',
                              nullable: true,
                              example: '/api/business/admins/profile-picture/abc123',
                              description:
                                'Serve URL for the profile picture, null if not uploaded',
                            },
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                email: { type: 'string', example: 'admin@acme.com' },
                                first_name: { type: 'string', nullable: true, example: 'Jane' },
                                last_name: { type: 'string', nullable: true, example: 'Doe' },
                              },
                            },
                          },
                        },
                      },
                      my_rights: {
                        description:
                          "The requesting user's own admin record. `null` if the user is not listed as an admin (e.g., a system ADMIN role).",
                        nullable: true,
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          role: { type: 'string', example: 'OWNER' },
                          position: {
                            type: 'string',
                            nullable: true,
                            example: 'CEO',
                          },
                          can_create: { type: 'boolean', example: true },
                          can_read: { type: 'boolean', example: true },
                          can_update: { type: 'boolean', example: true },
                          can_delete: { type: 'boolean', example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
    post: {
      tags: ['Business'],
      summary: 'Add a company admin',
      description:
        "Add a new admin to the authenticated user's company. Only admins with full rights (can_create, can_read, can_update, can_delete all set to `true`) can perform this action. The `company_id` is derived from the authenticated user's JWT.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'role'],
              properties: {
                user_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID of the user to grant admin access',
                },
                role: { type: 'string', example: 'MODERATOR' },
                position: { type: 'string', example: 'HR Manager' },
                can_create: { type: 'boolean', default: false },
                can_read: { type: 'boolean', default: true },
                can_update: { type: 'boolean', default: false },
                can_delete: { type: 'boolean', default: false },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Admin added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Admin added successfully' },
                  data: adminResponseSchema,
                },
              },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Unauthorized' },
        '403': { description: 'Insufficient permissions — full rights required' },
        '404': { description: 'Target user not found' },
        '409': { description: 'User is already an admin of this company' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
  '/business/admins/{id}': {
    delete: {
      tags: ['Business'],
      summary: 'Remove a company admin',
      description:
        "Remove an admin from the authenticated user's company by admin record ID. Only admins with full rights can perform this action. An admin cannot remove themselves.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'The company_admin record ID to remove',
        },
      ],
      responses: {
        '200': {
          description: 'Admin removed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Admin removed successfully' },
                  data: { type: 'null' },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '403': {
          description: 'Insufficient permissions — full rights required, or self-removal attempted',
        },
        '404': { description: 'Admin record not found' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
  '/business/admins/profile-picture': {
    patch: {
      tags: ['Business'],
      summary: 'Update admin profile picture',
      description:
        'Upload or replace the profile picture for the authenticated admin. ' +
        'Stored in the profile-picture bucket as `company_admin_<userId>.<ext>`.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['picture'],
              properties: {
                picture: {
                  type: 'string',
                  format: 'binary',
                  description: 'Image file (JPEG, PNG, or WebP, max 5MB)',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Admin profile picture updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Admin profile picture updated successfully',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      profile_picture: { type: 'string', example: 'company_admin_abc123.jpg' },
                      url: {
                        type: 'string',
                        example: '/api/business/admins/profile-picture/abc123',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'No image file provided' },
        '401': { description: 'Unauthorized' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
  '/business/admins/profile-picture/{userId}': {
    get: {
      tags: ['Business'],
      summary: 'Get admin profile picture',
      description:
        'Serves the profile picture image for a given admin user. No authentication required.',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'User ID of the admin',
        },
      ],
      responses: {
        '200': {
          description: 'Image file',
          content: {
            'image/jpeg': { schema: { type: 'string', format: 'binary' } },
            'image/png': { schema: { type: 'string', format: 'binary' } },
            'image/webp': { schema: { type: 'string', format: 'binary' } },
          },
        },
        '404': { description: 'Profile picture not found' },
      },
    },
  },
};

const locationSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    address: { type: 'string', example: '123 Main St' },
    city: { type: 'string', example: 'San Francisco' },
    state: { type: 'string', example: 'CA' },
    country: { type: 'string', example: 'USA' },
    postal_code: { type: 'string', example: '94105' },
    is_headquarter: { type: 'boolean', example: true },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

const getAllCompanies = {
  '/business': {
    get: {
      tags: ['Business'],
      summary: 'Get all companies with jobs',
      description:
        'Returns a paginated list of companies that have posted at least one job. Includes available industries for filter UI. No authentication required.',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 } },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 },
        },
        {
          name: 'industry',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by industry (exact match)',
          example: 'Technology',
        },
        {
          name: 'company_size',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by company size',
          example: '11-50',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by company name (case-insensitive)',
          example: 'acme',
        },
      ],
      responses: {
        '200': {
          description: 'Companies retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Companies retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      companies: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            company_name: { type: 'string', example: 'Acme Corp' },
                            industry: { type: 'string', example: 'Technology' },
                            company_size: { type: 'string', example: '11-50' },
                            about: { type: 'string', example: 'We build awesome products.' },
                            website: { type: 'string', example: 'https://acme.com' },
                            logo_url: { type: 'string', nullable: true },
                            open_positions: { type: 'integer', example: 8 },
                            companyLocations: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', format: 'uuid' },
                                  city: { type: 'string', example: 'San Francisco' },
                                  country: { type: 'string', example: 'USA' },
                                  is_headquarter: { type: 'boolean', example: true },
                                },
                              },
                            },
                          },
                        },
                      },
                      industries: {
                        type: 'array',
                        description:
                          'All distinct industries across companies with jobs — use for filter dropdown',
                        items: { type: 'string', example: 'Technology' },
                        example: ['Finance', 'Healthcare', 'Technology'],
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer', example: 42 },
                          page: { type: 'integer', example: 1 },
                          limit: { type: 'integer', example: 10 },
                          totalPages: { type: 'integer', example: 5 },
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
      },
    },
  },
};

const publicCompanyInfo = {
  '/business/{id}/public': {
    get: {
      tags: ['Business'],
      summary: 'Get public company info',
      description: 'Returns publicly visible company information. No authentication required.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Company ID',
        },
      ],
      responses: {
        '200': {
          description: 'Company info retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Company info retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      company_name: { type: 'string', example: 'Acme Corp' },
                      industry: { type: 'string', example: 'Technology' },
                      about: { type: 'string', example: 'We build awesome products.' },
                      company_size: { type: 'string', example: '11-50' },
                      website: { type: 'string', example: 'https://acme.com' },
                      logo_url: {
                        type: 'string',
                        nullable: true,
                        example: 'https://api.example.com/api/business/logo/companyId',
                      },
                      open_positions: { type: 'integer', example: 8 },
                      job_openings: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string', example: 'Frontend Engineer' },
                            location: { type: 'string', example: 'San Francisco, CA' },
                            location_type: {
                              type: 'string',
                              enum: ['REMOTE', 'ONSITE', 'HYBRID'],
                              example: 'HYBRID',
                            },
                            minimum_salary: { type: 'string', example: '80000' },
                            maximum_salary: { type: 'string', example: '120000' },
                          },
                        },
                      },
                      companyLocations: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            address: { type: 'string', example: '123 Main St' },
                            city: { type: 'string', example: 'San Francisco' },
                            state: { type: 'string', example: 'CA' },
                            country: { type: 'string', example: 'USA' },
                            postal_code: { type: 'string', example: '94105' },
                            is_headquarter: { type: 'boolean', example: true },
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
        '400': { description: 'Company ID is required' },
        '404': { description: 'Company not found' },
      },
    },
  },
};

const companyInfo = {
  '/business/info': {
    get: {
      tags: ['Business'],
      summary: 'Get company info',
      description:
        "Returns the authenticated user's full company profile including contact, socials, and locations.",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Company info retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Company info retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      company_name: { type: 'string', example: 'Acme Corp' },
                      industry: { type: 'string', example: 'Technology' },
                      about: { type: 'string', example: 'We build awesome products.' },
                      company_size: { type: 'string', example: '11-50' },
                      foundation_year: { type: 'integer', example: 2010 },
                      website: { type: 'string', example: 'https://acme.com' },
                      logo: { type: 'string', nullable: true },
                      logo_url: { type: 'string', nullable: true },
                      contact: {
                        nullable: true,
                        type: 'object',
                        properties: {
                          email: { type: 'string', example: 'hr@acme.com' },
                          phone: { type: 'string', example: '+1234567890' },
                        },
                      },
                      social_links: {
                        type: 'object',
                        properties: {
                          facebook: {
                            type: 'string',
                            nullable: true,
                            example: 'https://facebook.com/acme',
                          },
                          linkedin: {
                            type: 'string',
                            nullable: true,
                            example: 'https://linkedin.com/company/acme',
                          },
                          twitter: { type: 'string', nullable: true, example: null },
                          instagram: { type: 'string', nullable: true, example: null },
                        },
                      },
                      locations: { type: 'array', items: locationSchema },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
    patch: {
      tags: ['Business'],
      summary: 'Update company information',
      description:
        'Update basic company details. All fields are optional — only provided fields are updated.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                company_name: { type: 'string', example: 'Acme Corp' },
                industry: { type: 'string', example: 'Technology' },
                about: { type: 'string', example: 'We build awesome products.' },
                company_size: { type: 'string', example: '51-200' },
                foundation_year: { type: 'integer', example: 2010 },
                website: { type: 'string', example: 'https://acme.com' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Company info updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Company info updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      company_name: { type: 'string' },
                      industry: { type: 'string' },
                      about: { type: 'string' },
                      company_size: { type: 'string' },
                      foundation_year: { type: 'integer' },
                      website: { type: 'string' },
                      updated_at: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'Validation error — at least one field required' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
};

const socials = {
  '/business/socials': {
    patch: {
      tags: ['Business'],
      summary: 'Update social links',
      description:
        'Upsert social links for the company. Passing `null` for a platform removes that link. Only provided fields are processed.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                facebook: { type: 'string', nullable: true, example: 'https://facebook.com/acme' },
                linkedin: {
                  type: 'string',
                  nullable: true,
                  example: 'https://linkedin.com/company/acme',
                },
                twitter: { type: 'string', nullable: true, example: null },
                instagram: { type: 'string', nullable: true, example: null },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Social links updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Social links updated successfully' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        platform: {
                          type: 'string',
                          enum: ['FACEBOOK', 'TWITTER', 'LINKEDIN', 'INSTAGRAM'],
                        },
                        url: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
};

const contact = {
  '/business/contact': {
    patch: {
      tags: ['Business'],
      summary: 'Update contact info',
      description: 'Update company email and/or phone. At least one field is required.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email', example: 'hr@acme.com' },
                phone: { type: 'string', example: '+1234567890' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Contact info updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Contact info updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      email: { type: 'string', example: 'hr@acme.com' },
                      phone: { type: 'string', example: '+1234567890' },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'Validation error — at least one field required' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
};

const locations = {
  '/business/locations': {
    post: {
      tags: ['Business'],
      summary: 'Add a company location',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['address', 'city', 'state', 'country', 'postal_code'],
              properties: {
                address: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'San Francisco' },
                state: { type: 'string', example: 'CA' },
                country: { type: 'string', example: 'USA' },
                postal_code: { type: 'string', example: '94105' },
                is_headquarter: { type: 'boolean', default: false, example: false },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Location added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Location added successfully' },
                  data: locationSchema,
                },
              },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Company not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
  '/business/locations/{id}': {
    patch: {
      tags: ['Business'],
      summary: 'Update a company location',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Location ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                address: { type: 'string', example: '456 New St' },
                city: { type: 'string', example: 'Los Angeles' },
                state: { type: 'string', example: 'CA' },
                country: { type: 'string', example: 'USA' },
                postal_code: { type: 'string', example: '90001' },
                is_headquarter: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Location updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Location updated successfully' },
                  data: locationSchema,
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Location not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
    delete: {
      tags: ['Business'],
      summary: 'Delete a company location',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Location ID',
        },
      ],
      responses: {
        '200': {
          description: 'Location deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Location deleted successfully' },
                  data: { type: 'null' },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Location not found' },
        '422': { description: 'Company ID missing from token' },
      },
    },
  },
};

const applicantInfo = {
  '/business/applicants/{id}': {
    get: {
      tags: ['Business'],
      summary: 'Get applicant info by application ID',
      description:
        "Returns the full profile of an applicant who applied to one of the company's jobs, including skills, languages, experiences, education, resume link, and other positions they applied for within the same company. The `id` parameter is the `applicant_applied_job` record ID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Application ID (applicant_applied_job record ID)',
        },
      ],
      responses: {
        '200': {
          description: 'Applicant info retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Applicant info retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      application: {
                        type: 'object',
                        description: 'The specific application the company is viewing',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          status: {
                            type: 'string',
                            enum: ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'],
                            example: 'SCREENING',
                          },
                          application_date: { type: 'string', format: 'date-time' },
                          job: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              title: { type: 'string', example: 'Senior Engineer' },
                              department: { type: 'string', example: 'Engineering' },
                            },
                          },
                        },
                      },
                      applicant: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          first_name: { type: 'string', example: 'Jane' },
                          last_name: { type: 'string', example: 'Doe' },
                          email: { type: 'string', example: 'jane@example.com' },
                          desired_position: { type: 'string', example: 'Frontend Developer' },
                          location: { type: 'string', example: 'Manila, PH' },
                          gender: { type: 'string', example: 'Female' },
                          age: { type: 'integer', example: 27 },
                          profile_picture_url: { type: 'string', nullable: true },
                          resume_url: { type: 'string', nullable: true },
                          applicantSkills: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                skill_name: { type: 'string', example: 'React' },
                              },
                            },
                          },
                          applicantLanguages: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                language_name: { type: 'string', example: 'English' },
                                proficiency_level: {
                                  type: 'string',
                                  enum: ['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'],
                                  example: 'FLUENT',
                                },
                              },
                            },
                          },
                          applicantExperiences: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                company_name: { type: 'string', example: 'Acme Corp' },
                                position: { type: 'string', example: 'Software Engineer' },
                                start_date: { type: 'string', format: 'date-time' },
                                end_date: { type: 'string', format: 'date-time', nullable: true },
                                is_current: { type: 'boolean', example: false },
                              },
                            },
                          },
                          applicantEducations: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                institution_name: {
                                  type: 'string',
                                  example: 'University of Manila',
                                },
                                field_of_study: { type: 'string', example: 'Computer Science' },
                                start_year: { type: 'integer', example: 2016 },
                                end_year: { type: 'integer', nullable: true, example: 2020 },
                              },
                            },
                          },
                        },
                      },
                      other_applications: {
                        type: 'array',
                        description:
                          'Other positions this applicant applied for within the same company',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            status: {
                              type: 'string',
                              enum: ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'],
                              example: 'NEW',
                            },
                            application_date: { type: 'string', format: 'date-time' },
                            job: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                title: { type: 'string', example: 'Product Designer' },
                                department: { type: 'string', example: 'Design' },
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
        '400': { description: 'Application ID is required' },
        '401': { description: 'Unauthorized' },
        '404': { description: 'Application not found' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
};

const dashboard = {
  '/business/dashboard': {
    get: {
      tags: ['Business'],
      summary: 'Get company dashboard',
      description:
        "Returns a full dashboard snapshot for the authenticated user's company: summary counts, 8-week applicant trends, recent 5 applicants, and recent 5 job postings.",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Dashboard data retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Dashboard data retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      summary: {
                        type: 'object',
                        properties: {
                          total_jobs: { type: 'integer', example: 20 },
                          total_applicants: { type: 'integer', example: 150 },
                          new_applicants_this_week: { type: 'integer', example: 8 },
                          interviewed_applicants: { type: 'integer', example: 30 },
                        },
                      },
                      application_pipeline: {
                        type: 'array',
                        description: 'Count and percentage of applicants for each status',
                        items: {
                          type: 'object',
                          properties: {
                            status: {
                              type: 'string',
                              enum: ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'],
                              example: 'NEW',
                            },
                            count: { type: 'integer', example: 40 },
                            percentage: {
                              type: 'integer',
                              example: 27,
                              description: 'Rounded percentage of total applicants',
                            },
                          },
                        },
                      },
                      applicant_trends: {
                        type: 'array',
                        description:
                          'Weekly applicant counts for the past 8 weeks (oldest to newest)',
                        items: {
                          type: 'object',
                          properties: {
                            week_start: {
                              type: 'string',
                              format: 'date',
                              example: '2026-01-12',
                            },
                            count: { type: 'integer', example: 12 },
                          },
                        },
                      },
                      recent_applicants: {
                        type: 'array',
                        description: 'Most recent 5 applicants across all company jobs',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            status: {
                              type: 'string',
                              enum: ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'],
                              example: 'NEW',
                            },
                            application_date: { type: 'string', format: 'date-time' },
                            applicant_profile: {
                              type: 'object',
                              properties: {
                                first_name: { type: 'string', example: 'Jane' },
                                last_name: { type: 'string', example: 'Doe' },
                                desired_position: { type: 'string', example: 'Frontend Developer' },
                                profile_picture: { type: 'string', nullable: true },
                              },
                            },
                            job: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                title: { type: 'string', example: 'Senior Engineer' },
                                department: { type: 'string', example: 'Engineering' },
                              },
                            },
                          },
                        },
                      },
                      recent_jobs: {
                        type: 'array',
                        description: 'Most recent 5 job postings',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string', example: 'Senior Engineer' },
                            department: { type: 'string', example: 'Engineering' },
                            location: { type: 'string', example: 'Manila' },
                            employment_type: { type: 'string', example: 'FULL_TIME' },
                            location_type: {
                              type: 'string',
                              enum: ['ONSITE', 'REMOTE', 'HYBRID'],
                              example: 'HYBRID',
                            },
                            status: {
                              type: 'string',
                              enum: ['DRAFT', 'OPEN', 'CLOSED', 'PAUSED'],
                              example: 'OPEN',
                            },
                            created_at: { type: 'string', format: 'date-time' },
                            applicant_count: { type: 'integer', example: 14 },
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
        '401': { description: 'Unauthorized' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
};

const stats = {
  '/business/stats/jobs': {
    get: {
      tags: ['Business'],
      summary: 'Get job posting stats',
      description: "Returns job posting statistics for the authenticated user's company.",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Job posting stats retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Job posting stats retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      total_jobs: { type: 'integer', example: 20 },
                      active_jobs: { type: 'integer', example: 12 },
                      closed_jobs: { type: 'integer', example: 5 },
                      total_applicants: { type: 'integer', example: 150 },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
  '/business/stats/applicants': {
    get: {
      tags: ['Business'],
      summary: 'Get applicant stats',
      description: "Returns applicant statistics for the authenticated user's company.",
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Applicant stats retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Applicant stats retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      total_applicants: { type: 'integer', example: 150 },
                      in_interview: { type: 'integer', example: 30 },
                      hired: { type: 'integer', example: 10 },
                      rejected: { type: 'integer', example: 40 },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
};

export const companyDocs = {
  ...getTopCompanies,
  ...getAllCompanies,
  ...onboarding,
  ...logo,
  ...admins,
  ...publicCompanyInfo,
  ...companyInfo,
  ...socials,
  ...contact,
  ...locations,
  ...dashboard,
  ...applicantInfo,
  ...stats,
};
