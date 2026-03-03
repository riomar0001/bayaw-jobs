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
                    social_links: [{ platform: 'LINKEDIN', url: 'https://linkedin.com/company/acme' }],
                    locations: [
                      {
                        address: '123 Main St',
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'USA',
                        postal_code: '94105',
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
      description: 'Upload a new logo for the authenticated user\'s company.',
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
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', format: 'uuid' },
                                email: {
                                  type: 'string',
                                  example: 'admin@acme.com',
                                },
                                first_name: {
                                  type: 'string',
                                  nullable: true,
                                  example: 'Jane',
                                },
                                last_name: {
                                  type: 'string',
                                  nullable: true,
                                  example: 'Doe',
                                },
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
        'Add a new admin to the authenticated user\'s company. Only admins with full rights (can_create, can_read, can_update, can_delete all set to `true`) can perform this action. The `company_id` is derived from the authenticated user\'s JWT.',
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
        'Remove an admin from the authenticated user\'s company by admin record ID. Only admins with full rights can perform this action. An admin cannot remove themselves.',
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
        '403': { description: 'Insufficient permissions — full rights required, or self-removal attempted' },
        '404': { description: 'Admin record not found' },
        '422': { description: 'Company ID missing from token — user has no company' },
      },
    },
  },
};

export const companyDocs = {
  ...onboarding,
  ...logo,
  ...admins,
};
