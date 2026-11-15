-- CreateTable
CREATE TABLE "assessment_targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "description" TEXT,
    "authorization_note" TEXT,
    "test_window_start" DATETIME,
    "test_window_end" DATETIME,
    "created_by" TEXT,
    "created_by_email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "scope_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "in_scope" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scope_rules_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "assessment_targets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "params" JSONB,
    "raw_output_key" TEXT,
    "error" TEXT,
    "started_by" TEXT,
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scans_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "assessment_targets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scan_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scan_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scan_results_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "scans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "findings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "scan_id" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "affected_asset" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "ai_severity" TEXT,
    "final_severity" TEXT,
    "cvss_vector" TEXT,
    "cvss_score" REAL,
    "owasp_top10" TEXT,
    "wstg_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remediation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "findings_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "assessment_targets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "findings_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "scans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "finding_id" TEXT NOT NULL,
    "scan_result_id" TEXT,
    "type" TEXT NOT NULL,
    "r2_key" TEXT,
    "content" TEXT,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evidence_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "evidence_scan_result_id_fkey" FOREIGN KEY ("scan_result_id") REFERENCES "scan_results" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scan_id" TEXT,
    "finding_id" TEXT,
    "task" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "output" JSONB NOT NULL,
    "tokens_in" INTEGER,
    "tokens_out" INTEGER,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_analyses_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "finding_id" TEXT NOT NULL,
    "assessor_id" TEXT,
    "assessor_email" TEXT,
    "old_status" TEXT NOT NULL,
    "new_status" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verification_logs_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assessment_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ref_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "payload" JSONB,
    "attempts_made" INTEGER NOT NULL DEFAULT 0,
    "failed_reason" TEXT,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" DATETIME,
    "finished_at" DATETIME
);

-- CreateIndex
CREATE INDEX "scope_rules_target_id_idx" ON "scope_rules"("target_id");

-- CreateIndex
CREATE INDEX "scans_target_id_created_at_idx" ON "scans"("target_id", "created_at");

-- CreateIndex
CREATE INDEX "scans_status_idx" ON "scans"("status");

-- CreateIndex
CREATE INDEX "scan_results_scan_id_idx" ON "scan_results"("scan_id");

-- CreateIndex
CREATE INDEX "findings_target_id_status_idx" ON "findings"("target_id", "status");

-- CreateIndex
CREATE INDEX "findings_scan_id_idx" ON "findings"("scan_id");

-- CreateIndex
CREATE INDEX "evidence_finding_id_idx" ON "evidence"("finding_id");

-- CreateIndex
CREATE INDEX "ai_analyses_scan_id_idx" ON "ai_analyses"("scan_id");

-- CreateIndex
CREATE INDEX "ai_analyses_finding_id_idx" ON "ai_analyses"("finding_id");

-- CreateIndex
CREATE INDEX "verification_logs_finding_id_idx" ON "verification_logs"("finding_id");

-- CreateIndex
CREATE INDEX "assessment_jobs_type_status_idx" ON "assessment_jobs"("type", "status");
