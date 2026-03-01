const applicantProfileSchema = {
  type: 'object',
  properties: {
    first_name: { type: 'string', example: 'John' },
    last_name: { type: 'string', example: 'Doe' },
    email: { type: 'string', format: 'email', example: 'john@example.com' },
    age: { type: 'integer', example: 25 },
    gender: { type: 'string', example: 'Male' },
    desired_position: { type: 'string', example: 'Software Engineer' },
  },
  required: ['first_name', 'last_name', 'email', 'age', 'gender', 'desired_position'],
};

const onboarding = {
  '/applicants/onboarding': {
    post: {
      tags: ['Applicants'],
      summary: 'Complete applicant onboarding',
      description:
        'Submits the full applicant profile including education, experience, skills, and languages. Marks the user as having completed onboarding. Requires a valid Bearer access token.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['profile', 'education', 'skills', 'languages'],
              properties: {
                profile: applicantProfileSchema,
                education: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['institution_name', 'field_of_study', 'start_year'],
                    properties: {
                      institution_name: { type: 'string', example: 'State University' },
                      field_of_study: { type: 'string', example: 'Computer Science' },
                      start_year: { type: 'integer', example: 2018 },
                      end_year: { type: 'integer', nullable: true, example: 2022 },
                    },
                  },
                },
                experience: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['company_name', 'position', 'start_date', 'is_current'],
                    properties: {
                      company_name: { type: 'string', example: 'Tech Corp' },
                      position: { type: 'string', example: 'Junior Developer' },
                      start_date: {
                        type: 'string',
                        format: 'date',
                        example: '2022-01-01',
                      },
                      is_current: { type: 'boolean', example: false },
                      end_date: {
                        type: 'string',
                        format: 'date',
                        nullable: true,
                        example: '2023-06-01',
                      },
                    },
                  },
                },
                skills: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['skill_name'],
                    properties: {
                      skill_name: { type: 'string', example: 'TypeScript' },
                    },
                  },
                },
                languages: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['language_name', 'proficiency_level'],
                    properties: {
                      language_name: { type: 'string', example: 'English' },
                      proficiency_level: {
                        type: 'string',
                        enum: ['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'],
                        example: 'FLUENT',
                      },
                    },
                  },
                },
              },
            },
            example: {
              profile: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                age: 25,
                gender: 'Male',
                desired_position: 'Software Engineer',
              },
              education: [
                {
                  institution_name: 'State University',
                  field_of_study: 'Computer Science',
                  start_year: 2018,
                  end_year: 2022,
                },
              ],
              experience: [
                {
                  company_name: 'Tech Corp',
                  position: 'Junior Developer',
                  start_date: '2022-01-01',
                  is_current: false,
                  end_date: '2023-06-01',
                },
              ],
              skills: [{ skill_name: 'TypeScript' }, { skill_name: 'Node.js' }],
              languages: [{ language_name: 'English', proficiency_level: 'FLUENT' }],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Onboarding completed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Onboarding completed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'a1b2c3d4-...' },
                      user_id: { type: 'string', example: 'u1b2c3d4-...' },
                      first_name: { type: 'string', example: 'John' },
                      last_name: { type: 'string', example: 'Doe' },
                      email: { type: 'string', example: 'john@example.com' },
                      age: { type: 'integer', example: 25 },
                      gender: { type: 'string', example: 'Male' },
                      desired_position: { type: 'string', example: 'Software Engineer' },
                      applicantEducations: { type: 'array', items: { type: 'object' } },
                      applicantExperiences: { type: 'array', items: { type: 'object' } },
                      applicantSkills: { type: 'array', items: { type: 'object' } },
                      applicantLanguages: { type: 'array', items: { type: 'object' } },
                      applicantResumes: { type: 'array', items: { type: 'object' } },
                      created_at: { type: 'string', format: 'date-time' },
                      updated_at: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error or onboarding already completed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Onboarding has already been completed' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized — missing or invalid Bearer token',
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
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'User not found' },
                },
              },
            },
          },
        },
        409: {
          description: 'Applicant profile or email already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Applicant profile already exists' },
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

const getProfile = {
  '/applicants/profile': {
    get: {
      tags: ['Applicants'],
      summary: 'Get applicant profile',
      description:
        'Returns the authenticated applicant\'s full profile including education, experience, skills, languages, and resumes.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Profile retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'a1b2c3d4-...' },
                      user_id: { type: 'string', example: 'u1b2c3d4-...' },
                      first_name: { type: 'string', example: 'John' },
                      last_name: { type: 'string', example: 'Doe' },
                      email: { type: 'string', example: 'john@example.com' },
                      age: { type: 'integer', example: 25 },
                      gender: { type: 'string', example: 'Male' },
                      desired_position: { type: 'string', example: 'Software Engineer' },
                      applicantEducations: { type: 'array', items: { type: 'object' } },
                      applicantExperiences: { type: 'array', items: { type: 'object' } },
                      applicantSkills: { type: 'array', items: { type: 'object' } },
                      applicantLanguages: { type: 'array', items: { type: 'object' } },
                      applicantResumes: { type: 'array', items: { type: 'object' } },
                      created_at: { type: 'string', format: 'date-time' },
                      updated_at: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized — missing or invalid Bearer token',
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
        404: {
          description: 'Applicant profile not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Applicant profile not found' },
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

export const applicantDocs = {
  ...onboarding,
  ...getProfile,
};
