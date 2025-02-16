import express from "express";
import { protect } from "@/middlewares/ApplicantAuthHandler";
import authApplicant from "@/controllers/applicants/Auth";
import checkAuthApplicant from "@/controllers/applicants/checkAuth";
import updateContact from "@/controllers/applicants/updateContact";
import {
  registerAccount,
  accountOnboarding,
} from "@/controllers/applicants/registerAccount";
import updateProfilePicture from "@/controllers/applicants/updateProfilePicture";
import uploadProfilePicture from "@/middlewares/uploadProfilePictureHandler";
import uploadResume from "@/middlewares/uploadResumeHandler";
import updateResume from "@/controllers/applicants/updateResume";

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
router.post("/", registerAccount);
router.post(
  "/onboarding",

  protect,
  // uploadProfilePicture.fields([{ name: "profile_picture", maxCount: 1 }]),
  uploadResume.fields([{ name: "resume", maxCount: 1 }]),
  accountOnboarding
);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */
router.put("/contact", protect, updateContact);
router.put(
  "/profile-picture",
  protect,
  uploadProfilePicture.fields([{ name: "profile_picture", maxCount: 1 }]),
  updateProfilePicture
);
router.put(
  "/resume",
  protect,
  uploadResume.fields([{ name: "resume", maxCount: 1 }]),
  updateResume
);

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */

export default router;
