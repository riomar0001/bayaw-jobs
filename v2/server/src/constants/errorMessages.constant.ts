export const ErrorMessages = {
  // Authentication
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    ACCOUNT_LOCKED: 'Account is temporarily locked due to too many failed login attempts',
    ACCOUNT_SUSPENDED: 'Your account has been suspended',
    ACCOUNT_DELETED: 'This account has been deleted',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_REQUIRED: 'Authentication token is required',
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
    REFRESH_TOKEN_INVALID: 'Invalid or expired refresh token',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_VERIFICATION_CODE: 'Invalid verification code',
    VERIFICATION_CODE_EXPIRED: 'Verification code has expired',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',
    USER_NOT_FOUND: 'User not found',
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_REQUIREMENTS:
      'Password must contain uppercase, lowercase, number, and special character',
    INVALID_ID: 'Invalid ID format',
  },

  // Storage
  STORAGE: {
    UPLOAD_FAILED: 'Failed to upload file',
    DOWNLOAD_FAILED: 'Failed to download file',
    DELETE_FAILED: 'Failed to delete file',
    FILE_NOT_FOUND: 'File not found',
    INVALID_FILE_TYPE: 'Invalid file type',
  },

  // General
  GENERAL: {
    INTERNAL_ERROR: 'An unexpected error occurred',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Invalid request',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  },
} as const;

export default ErrorMessages;
