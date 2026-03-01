// ─── Shared response schemas ─────────────────────────────────────────────────

const unauthorizedResponse = {
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

// ─── Shared profile data schema ───────────────────────────────────────────────

const applicantProfileSchema = {
  type: 'object',
  properties: {
    age: { type: 'integer', example: 25 },
    gender: { type: 'string', example: 'Male' },
    desired_position: { type: 'string', example: 'Software Engineer' },
  },
  required: ['age', 'gender', 'desired_position'],
};

const applicantProfileResponseData = {
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
    profile_picture: {
      type: 'string',
      nullable: true,
      example: 'profile_550e8400-e29b-41d4-a716-446655440000.jpg',
      description: 'Filename stored in the profile-picture Supabase bucket',
    },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    applicantEducations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'e1b2c3d4-...' },
          applicant_profile_id: { type: 'string', example: 'a1b2c3d4-...' },
          institution_name: { type: 'string', example: 'State University' },
          field_of_study: { type: 'string', example: 'Computer Science' },
          start_year: { type: 'integer', example: 2018 },
          end_year: { type: 'integer', nullable: true, example: 2022 },
        },
      },
    },
    applicantExperiences: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'x1b2c3d4-...' },
          applicant_profile_id: { type: 'string', example: 'a1b2c3d4-...' },
          company_name: { type: 'string', example: 'Tech Corp' },
          position: { type: 'string', example: 'Junior Developer' },
          start_date: { type: 'string', format: 'date-time', example: '2022-01-01T00:00:00.000Z' },
          end_date: { type: 'string', format: 'date-time', nullable: true, example: '2023-06-01T00:00:00.000Z' },
          is_current: { type: 'boolean', example: false },
        },
      },
    },
    applicantSkills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 's1b2c3d4-...' },
          applicant_profile_id: { type: 'string', example: 'a1b2c3d4-...' },
          skill_name: { type: 'string', example: 'TypeScript' },
        },
      },
    },
    applicantLanguages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'l1b2c3d4-...' },
          applicant_profile_id: { type: 'string', example: 'a1b2c3d4-...' },
          language_name: { type: 'string', example: 'English' },
          proficiency_level: {
            type: 'string',
            enum: ['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'],
            example: 'FLUENT',
          },
        },
      },
    },
    resume_url: {
      type: 'string',
      format: 'uri',
      nullable: true,
      example: 'http://localhost:4000/api/applicants/resume/a1b2c3d4-...',
      description: 'API endpoint to retrieve the resume PDF. Null if no resume has been uploaded.',
    },
  },
};

// ─── POST /applicants/onboarding ─────────────────────────────────────────────

const onboarding = {
  '/applicants/onboarding': {
    post: {
      tags: ['Applicants'],
      summary: 'Complete applicant onboarding',
      description:
        'Submits the full applicant profile including education, experience, skills, and languages. ' +
        'First name and last name are taken from the authenticated user\'s registration data — they do not need to be provided here. ' +
        'Accepts `multipart/form-data`: send all JSON fields as a stringified JSON string in the `data` field, ' +
        'and attach a PDF resume in the `resume` field (required). ' +
        'Automatically uploads the default profile picture to the `profile-picture` Supabase bucket. ' +
        'Marks the user as having completed onboarding. Requires a valid Bearer access token.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['data', 'resume'],
              properties: {
                data: {
                  type: 'string',
                  format: 'json',
                  description:
                    'Stringified JSON containing the onboarding payload (profile, education, experience, skills, languages).',
                  example: JSON.stringify({
                    profile: {
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
                  }),
                },
                resume: {
                  type: 'string',
                  format: 'binary',
                  description: 'Required PDF resume (max 10MB). Stored as `resume_<userId>.pdf`.',
                },
              },
            },
          },
          'application/json': {
            description: 'JSON body (without resume). Use multipart/form-data to include a resume.',
            schema: {
              type: 'object',
              required: ['profile', 'skills', 'languages'],
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
                      start_date: { type: 'string', format: 'date', example: '2022-01-01' },
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
                    allOf: [
                      applicantProfileResponseData,
                      {
                        type: 'object',
                        properties: {
                          resume_url: {
                            type: 'string',
                            format: 'uri',
                            nullable: true,
                            example: 'http://localhost:4000/api/applicants/resume/a1b2c3d4-...',
                            description: 'API endpoint to retrieve the uploaded resume PDF. No authentication required.',
                          },
                        },
                      },
                    ],
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
        401: unauthorizedResponse,
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
        500: internalErrorResponse,
      },
    },
  },
};

// ─── GET /applicants/profile ──────────────────────────────────────────────────

const getProfile = {
  '/applicants/profile': {
    get: {
      tags: ['Applicants'],
      summary: 'Get applicant profile',
      description:
        "Returns the authenticated applicant's full profile including education, experience, skills, languages, and resumes.",
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
                  data: applicantProfileResponseData,
                },
              },
            },
          },
        },
        401: unauthorizedResponse,
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
        500: internalErrorResponse,
      },
    },
  },
};

// ─── GET /applicants/resume/{id} ─────────────────────────────────────────────

const getResume = {
  '/applicants/resume/{id}': {
    get: {
      tags: ['Applicants'],
      summary: 'Get resume',
      description:
        "Streams an applicant's resume as a PDF by their profile ID. " +
        'The file is proxied through the API — the Supabase storage URL is never exposed to the client. ' +
        'No authentication required.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Applicant profile ID',
          schema: { type: 'string'},
        },
      ],
      responses: {
        200: {
          description: 'Resume PDF streamed successfully',
          headers: {
            'Content-Type': {
              schema: { type: 'string', example: 'application/pdf' },
            },
            'Content-Disposition': {
              schema: {
                type: 'string',
                example: 'inline; filename="resume_550e8400-e29b-41d4-a716-446655440000.pdf"',
              },
            },
          },
          content: {
            'application/pdf': {
              schema: { type: 'string', format: 'binary' },
            },
          },
        },
        404: {
          description: 'Applicant profile or resume not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Resume not found' },
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

export const applicantDocs = {
  ...onboarding,
  ...getProfile,
  ...getResume,
};
