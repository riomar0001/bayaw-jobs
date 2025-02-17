import express from "express";
import { protect } from "@/middlewares/ApplicantAuthHandler";
import authApplicant from "@/controllers/applicants/Auth";
import checkAuthApplicant from "@/controllers/applicants/checkAuth";
import {
  registerAccount,
  accountOnboarding,
} from "@/controllers/applicants/registerAccount";
import updateProfilePicture from "@/controllers/applicants/updateProfilePicture";
import uploadProfilePicture from "@/middlewares/uploadProfilePictureHandler";
import uploadResume from "@/middlewares/uploadResumeHandler";
import updateResume from "@/controllers/applicants/updateResume";
import addExperience from "@/controllers/applicants/addExperience";
import updateExperience from "@/controllers/applicants/updateExperience";
import deleteExperience from "@/controllers/applicants/deleteExperience";
import logoutAccount from "@/controllers/applicants/logoutAccount";

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
  uploadResume.fields([{ name: "resume", maxCount: 1 }]),
  accountOnboarding
);
router.post("/experience", protect, addExperience);
router.post("/logout", protect, logoutAccount);

/**
 * @Reminder Place all PUT requests here
 * @Format router.put("path", "middleware", "controller");
 */
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
router.put("/experience/:experience_id", protect, updateExperience);

/**
 * @Reminder Place all DELETE requests here
 * @Format router.delete("path", "middleware", "controller");
 */
router.delete("/experience/:experience_id", protect, deleteExperience);

export default router;
