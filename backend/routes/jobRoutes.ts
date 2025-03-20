import express from "express";
import { protect } from "@/middlewares/CompanyAuthHandler";
import { protect as applicantProtect } from "@/middlewares/ApplicantAuthHandler";

import { postJob } from "@/controllers/jobs/postJob";
import { getJobByCompany } from "@/controllers/jobs/getJobByCompany";
import { getJobById } from "@/controllers/jobs/getJobById";

import { updateJob } from "@/controllers/jobs/updateJob";
import { getAllJobs } from "@/controllers/jobs/getAllJobs";
import { deleteJob } from "@/controllers/jobs/deleteJob";
import { getRecentJobs } from "@/controllers/jobs/getRecentJobs";
import { getJobPicks } from "@/controllers/jobs/getJobPicks";
import { getApplicantByJobId } from "@/controllers/jobs/getApplicantsByJobId";
import { checkIfApplied } from "@/controllers/jobs/checkIfApplied";
import { applyJob } from "@/controllers/jobs/applyJob";
import { cancelJobApplication } from "@/controllers/jobs/cancelJobApplication";
import { getAppliedJobs } from "@/controllers/jobs/getAppliedJobs";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/appliedJobs", applicantProtect, getAppliedJobs);
router.get("/company", protect, getJobByCompany);
router.get("/:job_id", getJobById);


router.get("/", getAllJobs);
router.get("/all/recent", getRecentJobs);
router.get("/all/picks", getJobPicks);
router.get("/applicants/:job_posting_id", protect, getApplicantByJobId);
router.get("/applied/:job_posting_id", applicantProtect, checkIfApplied);

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
router.delete("/:job_id", protect, deleteJob);
router.delete(
    "/cancel/:job_posting_id",
    applicantProtect,
    cancelJobApplication
  );

export default router;
