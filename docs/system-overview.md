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
- Authentication with email verification and two-step login (OTP); OTP is on by default but users can disable it from security settings.
- Applicant onboarding, profile management, resume upload, and application tracking.
- Company onboarding, job posting management, applicant review, and admin management.
- Admin overview dashboards for users, businesses, applicants, jobs, security event log, and email queues.
- Admin user management: ban/unban users with configurable duration (1d, 3d, 7d, 30d, permanent), cascading job pausing on ban and restoration on unban.
- Security event logging: tracks login attempts, OTP failures, account locks, bans, password changes, and session events; admin-facing Event Log page with filtering and stats.
- Email queue management via BullMQ: view waiting, active, failed, and dead-letter queue (DLQ) jobs with retry and clear actions.
- Email notifications for verification, OTP, password resets, and application updates.
- Public browsing of jobs and companies with search and filters.

### UI Modules
- Landing pages: home, about, contact, privacy, terms.
- Auth pages: login (with optional OTP step), signup, forgot password, reset password.
- Applicant UI: jobs, job detail, applications, profile, onboarding, settings (information, password, security, login history).
- Company UI: dashboard, jobs management, applicants, business profile, settings (profile, security with OTP toggle, login history).
- Admin UI: overview, users (with ban/unban), businesses, applicants, jobs, Security group (Event Log, Queues).
- Banned page: shown to banned users with ban reason and expiry information.

## Target Users
- Applicants (job seekers).
- Company owners and company admins (employers).
- Platform administrators (system admins).

## Security Implementations
- JWT-based access and refresh tokens with httpOnly cookies.
- Email verification required before login.
- OTP-based second-step login (email code); configurable per user, always bypassed for admin accounts.
- Role-based access control for admin and company actions.
- Input validation using Zod schemas on all endpoints.
- Password hashing with bcrypt; refresh token hashing in storage.
- Per-account login attempt tracking: accounts locked after 5 failed attempts for 15 minutes, with live countdown shown in admin UI.
- IP-based rate limiting: 10 requests per 5 minutes
- Ban system: admins can ban accounts with a reason and duration; banned sessions are revoked immediately; open jobs are paused; temporary bans auto-lift on next login attempt.
- Security event log: all significant auth and account events are recorded with IP, user agent, severity, and metadata; ADMIN_ACTION events are filtered from the default view.
- Security headers via Helmet and CORS configuration.
- File upload validation for size and MIME type (PDF resumes, image uploads).
- Server-side logging and metrics for monitoring and auditing.
