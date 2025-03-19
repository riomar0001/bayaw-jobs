import express from "express";
import { protect } from "@/middlewares/CompanyAuthHandler";
import { protect as applicantProtect } from "@/middlewares/ApplicantAuthHandler";

import { postJob } from "@/controllers/jobs/postJob";
import { getJobByCompany } from "@/controllers/jobs/getJobByCompany";
import { getJobById } from "@/controllers/jobs/getJobById";

import { updateJob } from "@/controllers/jobs/updateJob";
import { getAllJobs } from "@/controllers/jobs/getAllJobs";
import { getRecentJobs } from "@/controllers/jobs/getRecentJobs";
import { getJobPicks } from "@/controllers/jobs/getJobPicks";
import { getApplicantByJobId } from "@/controllers/jobs/getApplicantsByJobId";

import { applyJob } from "@/controllers/jobs/applyJob";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/:job_id", protect, getJobById);
router.get("/company", protect, getJobByCompany);
router.get("/", protect, getAllJobs);
router.get("/all/recent", getRecentJobs);
router.get("/all/picks", getJobPicks);
router.get("/applicants/:job_posting_id", protect, getApplicantByJobId);

/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */

router.post("/", protect, postJob);
router.post("/apply/:job_posting_id", applicantProtect, applyJob);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */
router.put("/:job_posting_id", protect, updateJob);

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
