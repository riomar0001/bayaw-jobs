import express from "express";
import { protect } from "@/middlewares/CompanyAuthHandler";
import { postJob } from "@/controllers/jobs/postJob";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */


/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */

router.post("/", protect, postJob);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
