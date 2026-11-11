-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" DATETIME,
    "password_changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" DATETIME,
    "otp_enabled" BOOLEAN NOT NULL DEFAULT true,
    "ban_reason" TEXT,
    "ban_expires_at" DATETIME,
    "banned_at" DATETIME,
    "last_login_at" DATETIME,
    "last_activity_at" DATETIME,
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "revoked_at" DATETIME,
    "expires_at" DATETIME NOT NULL,
    "last_used" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "auth_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auth_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "user_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resource" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_read" BOOLEAN NOT NULL DEFAULT false,
    "can_update" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "role_id"),
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "desired_position" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "profile_picture" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "applicant_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_education_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "end_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_experience_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_skills_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,
    "proficiency_level" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_languages_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_career_status" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVELY_LOOKING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_career_status_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_resumes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "applicant_resumes_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_information" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "company_size" TEXT NOT NULL,
    "foundation_year" INTEGER NOT NULL,
    "website" TEXT NOT NULL,
    "logo" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_social_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_social_links_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "is_headquarter" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_locations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "position" TEXT,
    "can_update" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_read" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_admins_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "company_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_admin_profile_pictures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "company_admin_profile_pictures_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "company_admin_profile_pictures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "location_type" TEXT NOT NULL,
    "employment_type" TEXT NOT NULL,
    "minimum_salary" TEXT NOT NULL,
    "maximum_salary" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" JSONB NOT NULL,
    "qualifications" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_information" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applicant_applied_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicant_profile_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "application_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "jobId" TEXT,
    CONSTRAINT "applicant_applied_jobs_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "applicant_applied_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "queue" TEXT NOT NULL DEFAULT 'email',
    "type" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "attempts_made" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "failed_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" DATETIME,
    "finished_at" DATETIME
);

-- CreateTable
CREATE TABLE "queue_settings" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "is_paused" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "user_activities" (
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("user_id", "action", "day")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_last_login_at_idx" ON "users"("last_login_at");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_is_active_idx" ON "refresh_tokens"("is_active");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "auth_codes_user_id_idx" ON "auth_codes"("user_id");

-- CreateIndex
CREATE INDEX "auth_codes_expires_at_idx" ON "auth_codes"("expires_at");

-- CreateIndex
CREATE INDEX "security_events_type_idx" ON "security_events"("type");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");

-- CreateIndex
CREATE INDEX "security_events_user_id_idx" ON "security_events"("user_id");

-- CreateIndex
CREATE INDEX "security_events_created_at_idx" ON "security_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_key" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "applicant_profiles_user_id_idx" ON "applicant_profiles"("user_id");

-- CreateIndex
CREATE INDEX "applicant_education_applicant_profile_id_idx" ON "applicant_education"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "applicant_experience_applicant_profile_id_idx" ON "applicant_experience"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "applicant_skills_applicant_profile_id_idx" ON "applicant_skills"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "applicant_languages_applicant_profile_id_idx" ON "applicant_languages"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "applicant_career_status_applicant_profile_id_idx" ON "applicant_career_status"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "applicant_resumes_applicant_profile_id_idx" ON "applicant_resumes"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "company_information_user_id_idx" ON "company_information"("user_id");

-- CreateIndex
CREATE INDEX "company_contacts_company_id_idx" ON "company_contacts"("company_id");

-- CreateIndex
CREATE INDEX "company_social_links_company_id_idx" ON "company_social_links"("company_id");

-- CreateIndex
CREATE INDEX "company_locations_company_id_idx" ON "company_locations"("company_id");

-- CreateIndex
CREATE INDEX "company_admins_company_id_idx" ON "company_admins"("company_id");

-- CreateIndex
CREATE INDEX "company_admins_user_id_idx" ON "company_admins"("user_id");

-- CreateIndex
CREATE INDEX "company_admin_profile_pictures_company_id_idx" ON "company_admin_profile_pictures"("company_id");

-- CreateIndex
CREATE INDEX "company_admin_profile_pictures_user_id_idx" ON "company_admin_profile_pictures"("user_id");

-- CreateIndex
CREATE INDEX "jobs_company_id_idx" ON "jobs"("company_id");

-- CreateIndex
CREATE INDEX "applicant_applied_jobs_applicant_profile_id_idx" ON "applicant_applied_jobs"("applicant_profile_id");

-- CreateIndex
CREATE INDEX "email_jobs_queue_status_idx" ON "email_jobs"("queue", "status");
