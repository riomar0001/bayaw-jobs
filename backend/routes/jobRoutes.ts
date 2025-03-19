import express from "express";
import { protect } from "@/middlewares/CompanyAuthHandler";
import { postJob } from "@/controllers/jobs/postJob";
import { getJobByCompany } from "@/controllers/jobs/getJobByCompany";
import { updateJob } from "@/controllers/jobs/updateJob";
import { getAllJobs } from "@/controllers/jobs/getAllJobs";
const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */

router.get("/company", protect, getJobByCompany);
router.get("/", protect, getAllJobs);

/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */

router.post("/", protect, postJob);

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
