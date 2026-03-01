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

export const companyDocs = {
  ...onboarding,
  ...logo,
};
