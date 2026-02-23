export const Config = {
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Authentication
  AUTH: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_DURATION_MINUTES: 15,
    VERIFICATION_CODE_LENGTH: 6,
    VERIFICATION_CODE_EXPIRY_MINUTES: 10,
    PASSWORD_MIN_LENGTH: 8,
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX_REQUESTS: 10,
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg'],
    ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
  },

  // Email Queue
  EMAIL_QUEUE: {
    NAME: 'email',
    MAX_ATTEMPTS: 3,
    BACKOFF_TYPE: 'exponential' as const,
    BACKOFF_DELAY: 1000,
    CONCURRENCY: 5,
  },

  // Cookies
  COOKIES: {
    REFRESH_TOKEN_NAME: 'refreshToken',
    REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
    ACCESS_TOKEN_NAME: 'accessToken',
    ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000, // 15 minutes
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict' as const,
  },
} as const;

export default Config;
