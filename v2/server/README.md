# Bayaw Jobs API

A RESTful API for a job board platform built with Express.js and TypeScript.

## Features

- 🔐 **Authentication** - JWT-based authentication with access/refresh tokens and email verification
- 💼 **Job Postings** - Create, manage, and browse job listings
- 🏢 **Company Management** - Company onboarding, admin roles, and permissions
- 👤 **Applicant Profiles** - Full applicant profile management with resume and portfolio
- 📋 **Job Applications** - Apply to jobs and track application status
- 🔒 **Security** - Rate limiting, helmet security headers, file upload validation
- ✅ **Validation** - Request validation with Zod schemas
- 🧪 **Testing** - Comprehensive unit tests with Jest

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage
- **Email**: Nodemailer
- **Testing**: Jest

## Prerequisites

- Node.js >= 18.x
- PostgreSQL
- Redis
- Supabase account (for storage)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_TOKEN_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `4000` | Server port |
| `JWT_ACCESS_TOKEN_TTL` | `3h` | Access token expiration |
| `JWT_REFRESH_TOKEN_TTL` | `7d` | Refresh token expiration |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/verify-auth` | Verify auth code (2FA) |
| `GET` | `/api/auth/verify-email` | Verify email address |
| `POST` | `/api/auth/logout` | Logout current session |
| `POST` | `/api/auth/logout-all` | Logout all sessions |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/jobs/top` | No | Get top 8 most recent open jobs |
| `GET` | `/api/jobs` | No | List all jobs (paginated) |
| `GET` | `/api/jobs/:id` | No | Get job by ID |
| `GET` | `/api/jobs/company` | Yes | List jobs for authenticated company |
| `GET` | `/api/jobs/company/applicants` | Yes | Get all applicants across all company jobs (paginated) |
| `GET` | `/api/jobs/company/:id` | Yes | Get company job with applicants |
| `POST` | `/api/jobs/create` | Yes | Create a new job posting |
| `PUT` | `/api/jobs/:id` | Yes | Update a job posting |
| `PATCH` | `/api/jobs/:id/status` | Yes | Update job status |

### Business (Companies)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/business/top` | No | Get top 6 companies by open job count |
| `POST` | `/api/business/onboarding` | Yes | Onboard a new company |
| `PATCH` | `/api/business/logo` | Yes | Update company logo |
| `GET` | `/api/business/logo/:id` | No | Get company logo |
| `GET` | `/api/business/admins` | Yes | List company admins |
| `POST` | `/api/business/admins` | Yes | Add a company admin |
| `DELETE` | `/api/business/admins/:id` | Yes | Remove a company admin |

### Applicants

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/applicants/onboard` | Yes | Onboard applicant profile |
| `GET` | `/api/applicants/profile` | Yes | Get own applicant profile |
| `PUT` | `/api/applicants/profile` | Yes | Update applicant profile |
| `POST` | `/api/applicants/apply/:jobId` | Yes | Apply for a job |

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── __tests__/          # Test files
│   ├── configs/            # Configuration files
│   ├── constants/          # Constants and config values
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── queues/             # BullMQ queue workers
│   ├── repositories/       # Database repositories
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── templates/          # Email templates
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── validations/        # Zod validation schemas
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
└── generated/
    └── prisma/             # Generated Prisma types
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Configurable rate limits per endpoint
- **Helmet** - Security headers middleware
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Zod schema validation
- **File Upload Validation** - MIME type, extension, and magic byte verification
- **Image Content Validation** - Prevents malicious file uploads

## File Upload Limits

- **Max file size**: 10MB
- **Allowed types**: PNG, JPEG
- **Validation**: Magic bytes verification to prevent disguised files

## License

ISC

## Author

riomar0001
