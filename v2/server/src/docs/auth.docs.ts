const register = {
  '/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description:
        'Create a new user account. A verification email will be sent to the provided email address.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  minLength: 8,
                  example: 'SecurePass123!',
                  description:
                    'Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character',
                },
                first_name: {
                  type: 'string',
                  maxLength: 50,
                  example: 'John',
                },
                last_name: {
                  type: 'string',
                  maxLength: 50,
                  example: 'Doe',
                },
              },
              required: ['email', 'password', 'first_name', 'last_name'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example:
                      'Registration successful. Please check your email to verify your account.',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'usr_abc123xyz' },
                          email: { type: 'string', example: 'user@example.com' },
                          first_name: { type: 'string', example: 'John' },
                          last_name: { type: 'string', example: 'Doe' },
                          role: { type: 'string', example: 'user' },
                          is_verified: { type: 'boolean', example: false },
                          created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-02-02T10:30:00.000Z',
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
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'object',
                    example: {
                      email: ['Invalid email format'],
                      password: ['Password must contain at least one uppercase letter'],
                    },
                  },
                },
              },
            },
          },
        },
        409: {
          description: 'Email already exists',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Email already registered' },
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

const verifyEmail = {
  '/auth/verify-email': {
    get: {
      tags: ['Authentication'],
      summary: 'Verify email address',
      description:
        'Verify user email using the token sent to their email address during registration.',
      parameters: [
        {
          name: 'token',
          in: 'query',
          required: true,
          description: 'Email verification token',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Email verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Email verified successfully',
                  },
                  data: { type: 'null' },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Invalid or expired verification token',
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

const login = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login step 1 - Send auth code',
      description:
        'Authenticate user credentials. If valid, a 6-digit verification code will be sent to their email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  example: 'SecurePass123!',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Auth code sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Verification code sent to your email',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      temp_token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        description: 'Temporary token to use in verify-auth endpoint',
                      },
                      expires_in: {
                        type: 'number',
                        example: 300,
                        description: 'Token expiry time in seconds (5 minutes)',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'object',
                    example: { email: ['Invalid email format'] },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Invalid email or password' },
                },
              },
            },
          },
        },
        403: {
          description: 'Email not verified',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Please verify your email before logging in',
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

const verifyAuth = {
  '/auth/verify-auth': {
    post: {
      tags: ['Authentication'],
      summary: 'Login step 2 - Verify auth code',
      description:
        'Verify the 6-digit code sent to user email. Returns access token and sets refresh token in HTTP-only cookie.',
      security: [{ tempAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  minLength: 6,
                  maxLength: 6,
                  example: '123456',
                  description: '6-digit verification code',
                },
              },
              required: ['code'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          headers: {
            'Set-Cookie': {
              description: 'HTTP-only cookie containing refresh token',
              schema: {
                type: 'string',
                example: 'refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Path=/',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Login successful' },
                  data: {
                    type: 'object',
                    properties: {
                      access_token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'usr_abc123xyz' },
                          email: { type: 'string', example: 'user@example.com' },
                          first_name: { type: 'string', example: 'John' },
                          last_name: { type: 'string', example: 'Doe' },
                          role: { type: 'string', example: 'user' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid code format',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Verification code must be 6 digits' },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid or expired code/token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Invalid or expired verification code' },
                },
              },
            },
          },
        },
        429: {
          description: 'Too many attempts',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Too many verification attempts' },
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

const refresh = {
  '/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description:
        'Refresh the access token using the refresh token from HTTP-only cookie. Returns a new access token and rotates the refresh token.',
      responses: {
        200: {
          description: 'Token refreshed successfully',
          headers: {
            'Set-Cookie': {
              description: 'HTTP-only cookie containing new refresh token',
              schema: {
                type: 'string',
                example: 'refreshToken=newtoken123; HttpOnly; Secure; SameSite=Strict; Path=/',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Token refreshed successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      access_token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid or expired refresh token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Invalid or expired refresh token' },
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

const logout = {
  '/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      description:
        'Logout the user by invalidating the refresh token from HTTP-only cookie. Clears the cookie.',
      responses: {
        200: {
          description: 'Logged out successfully',
          headers: {
            'Set-Cookie': {
              description: 'Clears the refresh token cookie',
              schema: {
                type: 'string',
                example: 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Logged out successfully' },
                  data: { type: 'null' },
                },
              },
            },
          },
        },
        401: {
          description: 'No refresh token provided',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'No refresh token provided' },
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

const logoutAll = {
  '/auth/logout-all': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout from all devices',
      description:
        'Logout the user from all devices by invalidating all refresh tokens. Requires Bearer authentication.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Logged out from all devices',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Logged out from all devices' },
                  data: { type: 'null' },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - No token or invalid token',
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

export const authDocs = {
  ...register,
  ...verifyEmail,
  ...login,
  ...verifyAuth,
  ...refresh,
  ...logout,
  ...logoutAll,
};
