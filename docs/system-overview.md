# System Overview

## Pointers (Required)
- System Title: What is the name of your system?
- System Purpose: Briefly describe what the system does and who it is for.
- Core Features: Highlight the major features or modules of your system. Include the UI's.
- Target Users: Indicate the types of users and their roles in the system.
- Security Implementations: Describe the security features you have integrated (e.g., authentication, input validation, role-based access, libraries, middleware).

## System Title
Bayaw Jobs (Job Portal)

## System Purpose
Bayaw Jobs is a job portal that connects applicants with companies. It lets job seekers build profiles and apply to jobs, while employers manage job postings and review applicants. It also provides admin tools for platform oversight.

## Core Features
- Authentication with email verification and two-step login (OTP).
- Applicant onboarding, profile management, resume upload, and application tracking.
- Company onboarding, job posting management, applicant review, and admin management.
- Admin overview dashboards for users, businesses, applicants, jobs, and queues.
- Email notifications for verification, OTP, password resets, and application updates.
- Public browsing of jobs and companies with search and filters.

### UI Modules
- Landing pages: home, about, contact, privacy, terms.
- Auth pages: login, signup, forgot password, reset password.
- Applicant UI: jobs, job detail, applications, profile, onboarding.
- Company UI: dashboard, jobs management, applicants, business profile, settings.
- Admin UI: overview, users, businesses, applicants, jobs, queues.

## Target Users
- Applicants (job seekers).
- Company owners and company admins (employers).
- Platform administrators (system admins).

## Security Implementations
- JWT-based access and refresh tokens with httpOnly cookies.
- Email verification and OTP-based second-step login.
- Role-based access control for admin and company actions.
- Input validation using Zod schemas.
- Password hashing with bcrypt; refresh token hashing in storage.
- Rate limiting on API requests (general limiter configured).
- Security headers via Helmet and CORS configuration.
- File upload validation for size and MIME type (PDF resumes, image uploads).
- Server-side logging and metrics for monitoring and auditing.
