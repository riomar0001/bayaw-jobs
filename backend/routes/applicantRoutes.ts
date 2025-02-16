import express from "express";
import { upload as uploadProfilePicture } from "@/middlewares/uploadProfilePictureHandler";
import { upload as uploadResume } from "@/middlewares/uploadResumeHandler";
import authApplicant from "@/controllers/applicants/Auth";
import checkAuthApplicant from "@/controllers/applicants/checkAuth";
import { protect } from "@/middlewares/ApplicantAuthHandler";

const router = express.Router();

/**
 * @Reminder Place all GET requests here
 * @Format router.get("path", "middleware", "controller");
 */
router.get("/auth", protect, checkAuthApplicant);

/**
 * @Reminder Place all POST requests here
 * @Format router.post("path", "middleware", "controller");
 */
router.post("/auth", authApplicant);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
