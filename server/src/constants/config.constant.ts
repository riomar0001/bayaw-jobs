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

  // Demo deployment: auto-verify signups and skip email OTP, since demo email is
  // never delivered. Off unless DEMO_MODE is exactly "true".
  DEMO_MODE: process.env.DEMO_MODE === 'true',

  // Logins published on the demo login page. In demo mode their password and
  // email are locked so one visitor can't lock everyone else out until the reset.
  DEMO_SHARED_ACCOUNTS: ['admin@bayaw.com', 'owner@techcorp.com', 'kathleen.reyes@gmail.com'],

  // Daily per-user activity caps (demo). Counters reset with the nightly data reset.
  ACTIVITY_LIMITS: {
    APPLY: 10,
    POST_JOB: 5,
    UPLOAD: 10,
    WRITE: 100,
    SIGNUP: 5,
    CONTACT: 5,
    // BayawSec AI calls (interpret + remediate) per assessor per day. Applies outside demo mode too.
    AI_ANALYZE: Number(process.env.AI_DAILY_LIMIT ?? 20),
  },

  // BayawSec: AI-assisted security assessment module (admin only).
  BAYAWSEC: {
    ENABLED: process.env.BAYAWSEC_ENABLED === 'true',
    // Hosts any target, scope rule, upload or agent job may point at. Set in wrangler.jsonc.
    ALLOWED_HOSTS: (process.env.ASSESSMENT_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
    AI_PROVIDER: (process.env.AI_PROVIDER === 'ollama' ? 'ollama' : 'openai') as 'openai' | 'ollama',
    OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
    OLLAMA_URL: process.env.OLLAMA_URL ?? 'http://localhost:11434',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL ?? 'llama3.1:8b',
    AI_TEMPERATURE: 0.2,
    // Upper bound on tool output sent to the AI in one prompt (keeps cost and context small).
    AI_MAX_INPUT_CHARS: 12000,
    AI_TIMEOUT_MS: 60000,
    TOOL_TIMEOUT_MS: 15000,
    MAX_IMPORT_SIZE: 5 * 1024 * 1024, // 5MB Nmap XML / ZAP JSON
    SCANNER_AGENT_ENABLED: process.env.SCANNER_AGENT_ENABLED === 'true',
    QUEUE_NAME: 'bayaw-jobs-assessment',
    DLQ_NAME: 'bayaw-jobs-assessment-dlq',
    STORAGE_PREFIX: 'assessments/',
  },

  // Inbox for contact form messages (queued like every other email).
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL ?? 'support@bayawjobs.com',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
} as const;

export default Config;
