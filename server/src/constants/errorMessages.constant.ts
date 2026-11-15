export const ErrorMessages = {
  // Authentication
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    ACCOUNT_LOCKED: 'Account is temporarily locked due to too many failed login attempts',
    ACCOUNT_SUSPENDED: 'Your account has been suspended',
    ACCOUNT_BANNED: 'Your account has been banned',
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

  // BayawSec (security assessment)
  BAYAWSEC: {
    DISABLED: 'Not found',
    SHARED_ACCOUNT: 'BayawSec is not available to shared demo accounts. Use a personal admin account.',
    TARGET_NOT_FOUND: 'Assessment target not found',
    SCAN_NOT_FOUND: 'Scan not found',
    FINDING_NOT_FOUND: 'Finding not found',
    EVIDENCE_NOT_FOUND: 'Evidence not found',
    JOB_NOT_FOUND: 'Assessment job not found',
    ANALYSIS_NOT_FOUND: 'AI analysis not found',
    HOST_NOT_ALLOWED: 'This host is not on the BayawSec allowlist (ASSESSMENT_ALLOWED_HOSTS)',
    OUT_OF_SCOPE: 'Request is outside the authorized scope for this target',
    INVALID_URL: 'Target URL must be an http(s) URL',
    SCAN_NOT_DONE: 'The scan has not finished yet',
    SCAN_HAS_NO_RESULTS: 'The scan has no results to analyze',
    AGENT_DISABLED: 'The scanner agent is disabled (SCANNER_AGENT_ENABLED=false)',
    IMPORT_FILE_REQUIRED: 'A report file is required',
    IMPORT_INVALID: 'The uploaded file is not a valid report for this tool',
    AI_NOT_CONFIGURED: 'AI is not configured: set OPENAI_API_KEY or AI_PROVIDER=ollama',
    AI_FAILED: 'The AI request failed',
    AI_BAD_OUTPUT: 'The AI returned output in an unexpected format',
    CONFIRM_NEEDS_SEVERITY: 'Confirming a finding requires final_severity and cvss_score',
    FIXED_NEEDS_CONFIRMED: 'Only a confirmed finding can be marked as fixed',
  },
} as const;

export default ErrorMessages;
