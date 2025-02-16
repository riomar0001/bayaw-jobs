import express from "express";
import { upload as uploadProfilePicture } from "@/middlewares/uploadProfilePictureHandler";
import { upload as uploadResume } from "@/middlewares/uploadResumeHandler";
import { protect } from "@/middlewares/ApplicantAuthHandler";
import authApplicant from "@/controllers/applicants/Auth";
import checkAuthApplicant from "@/controllers/applicants/checkAuth";
import updateContact from "@/controllers/applicants/updateContact";
import addExperience from "@/controllers/applicants/addExperience";
import updateExperience from "@/controllers/applicants/updateExperience";

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
router.post("/experience", protect, addExperience);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */
router.put("/contact", protect, updateContact);
router.put("/experience/:experience_id", protect, updateExperience);
/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
